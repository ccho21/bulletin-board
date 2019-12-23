import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Post } from '@app/shared/models/post';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of } from 'rxjs';
import { mergeMap, concatMap } from 'rxjs/operators';
import { User } from '@app/shared/models/user';
import { UserActivities } from '@app/shared/models/user-activities';
// import { UserActivitiesService } from '@app/core/services/user-activities/user-activities.service';


@Injectable({
  providedIn          : 'root'
})
export class UserService {

  constructor(
    private db        : AngularFirestore,
    private logger    : LoggerService,
    //  private userActivitiesService    : UserActivitiesService
  ) { }

  /* Setting up user data when sign in with username/password, 
    sign up with username/password and sign in with social auth  
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: User) {
    const userRef     : AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    /* open activities */
    this.createActivities(user.uid);
    return userRef.set(user, {
      merge           : true
    });
  }

  createActivities(uid) {
    this.db.collection<UserActivities>('user-activities', ref => ref.where('uid', '==', uid)).get().subscribe(res => {
      if (res.docs.length === 0) {
        const activitiesDTO: UserActivities = {
          uid,
          likes       : [],
          bookmarks   : []
        };
        this.db.collection<UserActivities>('user-activities').doc(uid).set(activitiesDTO);
      }
    });
  }
}
