import { Injectable, NgZone } from '@angular/core';
import { User } from '@models/user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoggerService } from '../logger/logger.service';
import { FirebaseService } from '../firebase/firebase.service';
import { of, from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning,
    private logger: LoggerService,
    private fbService: FirebaseService
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }
  firebaseAuthChangeListener(response) {
    // if needed, do a redirect in here
    if (response) {
      console.log('Logged in :)', response);
      return response;
    } else {
      console.log('Logged out :(', response);
      return response;
    }
  }

  // Sign in with email/password
  signIn(email, password) {
    return from(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
    ).pipe(mergeMap(
      (result) => {
        let signSuccess: boolean;
        this.ngZone.run(() => {
          this.logger.info('### sign in', result);
          if (result.user.emailVerified) {
            const user = this.afAuth.auth.currentUser;
            this.logger.info(user);
            // this.router.navigate(['dashboard']);
            signSuccess = true;
          } else {
            signSuccess = false;
            this.logger.info('not verified');
            this.SendVerificationMail();
            throw 'Email verification is required';
          }
        });
        return of(signSuccess);
      }
    ));
  }

  // Sign up with email/password
  signUp(user) {
    this.logger.info(user);
    return this.afAuth.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(result => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        const userData: User = {
          uid: result.user.uid,
          email: result.user.email,
          emailVerified: result.user.emailVerified,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        this.logger.info(
          '### result from createUserWithEmailAndPassword',
          result
        );
        this.logger.info('### userdata DTO', userData);
        this.afAuth.auth.currentUser.updateProfile({
          displayName: user.displayName,
          photoURL: user.photoURL
        });
        this.SendVerificationMail();
        this.SetUserData(userData);
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.router.navigate(['verify-email-address']);
    });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch(error => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        this.ngZone.run(() => {
          this.logger.info('### auth logged in');
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      })
      .catch(error => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(userData) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userData.uid}`
    );
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign out
  signOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigateByUrl('/');
    });
  }
}
