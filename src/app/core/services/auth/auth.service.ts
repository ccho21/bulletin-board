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
import { of, from, Observable, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { LoaderService } from '../loader/loader.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data
  signInSource = new Subject<boolean>();
  signInSourceEmitted$ = this.signInSource.asObservable();
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning,
    private logger: LoggerService,
    private fbService: FirebaseService,
    private loaderService: LoaderService
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
    console.log('firebase Auth change Listener', response);
    if (response) {
      return response;
    } else {
      return response;
    }
  }
  updateSignInSource(updated: boolean) {
    this.signInSource.next(updated);
  }
  getSignInSource() {
    return this.signInSourceEmitted$;
  }
  // Sign in with email/password
  signIn(email, password) {
    // loader start
    this.loaderService.show();
    return from(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
    ).pipe(
      mergeMap(result => {
        let signSuccess: boolean;
        this.ngZone.run(() => {
          this.logger.info('### sign in', result);
          if (result.user.emailVerified) {
            const user = this.afAuth.auth.currentUser;
            this.logger.info(user);
            signSuccess = true;
          } else {
            signSuccess = false;
            this.logger.info('not verified');
            this.sendVerificationMail();
            this.loaderService.hide();
            throw 'Email verification is required';
          }
        });
        // loader end;
        this.loaderService.hide();
        return of(signSuccess);
      })
    );
  }

  // Sign up with email/password
  signUp(user) {
    // loader start
    this.loaderService.show();
    return from(this.afAuth.auth
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
        this.sendVerificationMail();
        this.setUserData(userData);
        // loader end
        this.loaderService.hide();
      })
      .catch(error => {
        window.alert(error.message);
      }));
  }

  // Send email verfificaiton when new user sign up
  sendVerificationMail() {
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
    return from(this.authLogin(new auth.GoogleAuthProvider()));
  }

  // Auth logic to run auth providers
  authLogin(provider) {
    this.logger.info('### provider', provider);
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        this.ngZone.run(() => {
          const userData: User = {
            uid: result.user.uid,
            email: result.user.email,
            emailVerified: result.user.emailVerified,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          };
          this.setUserData(userData);
          this.router.navigate(['/']);
        });
      })
      .catch(error => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(userData) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userData.uid}`
    );
    return userRef.set(userData, {
      merge: true
    });
  }

  getCurrentUser() {
    return this.afAuth.auth.currentUser;
  }

  // Sign out
  signOut() {
    this.loaderService.show();
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.loaderService.hide();
      this.router.navigateByUrl('/');
    });
  }
}
