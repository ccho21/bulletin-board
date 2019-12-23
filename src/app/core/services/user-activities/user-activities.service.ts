import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Like } from '@app/shared/models/like';
import { Post } from '@app/shared/models/post';
import { User } from '@app/shared/models/user';
import { UserActivities } from '@app/shared/models/user-activities';
@Injectable({
  providedIn: 'root'
})
export class UserActivitiesService {

  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
  
  ) { }
  
  getActivities(user) {
    this.logger.info('### user');
    return this.db.collection<UserActivities>('user-activities', ref => ref.where('uid', '==', user.uid)).get();
  }
  
  updateView(user: User, post: Post) {
    this.logger.info('### came in??', post);
   
    const viewId = this.db.createId();
    const postId = post.postId;
    const uid = user.uid;
    const activityDTO = {
      views: {viewId,
      postId,
      uid}
    }
    this.db.collection<UserActivities>('user-activities').doc(user.uid).update(activityDTO);
  }
}
