import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Post } from '@app/shared/models/post';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { mergeMap } from 'rxjs/operators';
import { User } from '@app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore, private logger: LoggerService) { }

  /* Setting up user data when sign in with username/password, 
    sign up with username/password and sign in with social auth  
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `users/${user.uid}`
    );
    return userRef.set(user, {
      merge: true
    });
  }
}
