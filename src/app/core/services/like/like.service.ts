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

  addLike(like: Like) {
    const id = this.db.createId();
    const likeDTO = this.cleanUndefined(like);
    like.likeId = id;
    
    this.logger.info('### final like dto', likeDTO);
    
    const query = this.db.collection<Like>('likes').doc(id).set(likeDTO);
    return of(query);
  }

  getLikesByUserId(type: number) { // by current user id
    const { uid } = this.authService.getCurrentUser();
    const query = this.db.collection('likes', ref =>
      ref.where("user.uid", "==", `${uid}`).where('type', '==', type)).valueChanges();
    return query;
  }

  isLiked(id, type) { // get data from current User Id and match with post id. 
    const query = this.getLikesByData(id, type).pipe(mergeMap(res => {
      this.logger.info(`### is type ${type} liked returned`,res);
      if (res.length) {
       return of(true);
      }
      else {
        return of(false)
      };
    }));
    return query;
  }

  getLikesByData(id: string, type) {
    const { uid } = this.authService.getCurrentUser();
    const q = type === 1 ? 'postId' : 'commentId';
    this.logger.info('### type is', type, '### id is', q, ': ', id);
    
    const query = this.db.collection('likes', ref =>
      ref.where(`${q}`, "==", `${id}`).where('type', '==', type).where('user.uid', '==', uid)).valueChanges();
    return query;
  }

  deleteLike(id: string, type: number) {
    const query = this.getLikesByData(id, type).pipe(mergeMap(res => res),take(1), mergeMap((like: any) => {
      return of(this.db.collection('likes').doc(like.likeId).delete());
    }));
    return query;
  }
  
  // HELPER
  cleanUndefined(dto) {
    const keys = Object.keys(dto);
    keys.forEach(cur => {
      this.logger.info(cur);
      if(!dto[cur]) {
        delete dto[cur];
      }
    })
    return dto;
  }
}
