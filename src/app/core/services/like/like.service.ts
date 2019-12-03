import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { of, Observable } from 'rxjs';
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

  addLike(dataId: string, like: Like, type: number) {
    const id = this.db.createId();
    const likeDTO = this.cleanUndefined(like);
    like.likeId = id;
    this.logger.info('### final like dto', likeDTO);
    const query = this.db.collection<Like>('likes').doc(likeDTO.likeId).set(likeDTO);
    return of(likeDTO);
  }

  isLiked(data, dataId: string, type: number) { // get data from current User Id and match with post id. 
    const query = this.getLikesByData(data, dataId, type).pipe(mergeMap(res => {
      this.logger.info('is Liked ', res);
      if (res.length) {
        return of(true);
      }
      else {
        return of(false)
      };
    }));
    return query;
  }

  getLikesByData(data: Like, dataId: string, type) {
    const { uid } = this.authService.getCurrentUser();
    const q = type === 1 ? 'postId' : 'commentId';
    // this.logger.info('### type is', type, '### id is', q, ': ', dataId);
    const query = this.db.collection('likes', ref =>
      ref.where('user.uid', '==', uid).where(`${q}`, '==', dataId).where('type', '==', type)).valueChanges();
    return query;
  }

  deleteLike(data, dataId: string, type: number) {
    const query = this.getLikesByData(data, dataId, type).pipe(mergeMap(res => res), take(1), mergeMap((like: any) => {
      // const likeId = like.payload.doc.data().likeId; 
      return of(this.db.collection('likes').doc(like.likeId).delete());
    }));
    return query;
  }

  // HELPER
  cleanUndefined(dto) {
    const keys = Object.keys(dto);
    keys.forEach(cur => {
      if (!dto[cur]) {
        delete dto[cur];
      }
    })
    return dto;
  }

  // getLikeCollectionByType(data, type) {
  //   if (type === 1) {
  //     return this.db.collection<Post>('posts').doc(data.postId);
  //   }
  //   if (type === 2) {
  //     return this.db.collection<Comment>('comments').doc(data.commentId);
  //   }
  // }

  getNumLikes(postId: string) {
    return this.db.collection<Post>('posts').doc(postId).collection<Like>('likes').valueChanges();
  }
}
