import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Like } from '@app/shared/models/like';
import { Post } from '@app/shared/models/post';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService
  ) { }

  addLike(data: Like) {
    const id = this.db.createId();
    data.likeId = id;
    const query = this.db.collection<Like>('likes').doc(id).set(data);
    return of(query);
  }
  
  getLikesByUserId(type: number) { // by current user id
    const { uid } = this.authService.getCurrentUser();
    const query = this.db.collection('likes', ref =>
      ref.where("user.uid", "==", `${uid}`).where('type', '==', type)).valueChanges();
    return query;
  }
  isLiked(postId, type) { // get data from current User Id and match with post id. 
    const query = this.getLikesByUserId(type).pipe(take(1), mergeMap(results => {
      const data = results.find((result: Like) => result.post.postId === postId);
      return of(data);
    }));
    return query;
  }

  getLikesBypostId(postId: string, uid: string,  type: number) {
    const query = this.db.collection('likes', ref =>
      ref.where('user.uid', '==', uid).where("postId", "==", `${postId}`).where('type', '==', type)).valueChanges();
    return query;
  }

  getLikesByData(id: string, type) {
    const q = type === 1 ? 'post.postId' : 'comment.commentId';
    const query = this.db.collection('likes', ref =>
    ref.where(`${q}`, '==', id).where('type', '==', type)).valueChanges();
    return query;
  }

  deleteLike(id: string, type) {
    const query = this.getLikesByData(id, type).pipe(take(1), mergeMap((likes: any) => {
      this.logger.info('### results', likes);
      return likes.length > 0 ? of(this.db.collection('likes').doc(likes[0].likeId).delete()) : of();
    }))
    return query;
  }
}
