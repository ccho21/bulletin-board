import { Injectable } from '@angular/core';
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { of, forkJoin, from, Observable, Observer } from 'rxjs';
import {  take} from 'rxjs/operators';
import { Like } from '@app/shared/models/like';
import { Post } from '@app/shared/models/post';
import { AuthService } from '../auth/auth.service';
import { Comment } from '@app/shared/models/comment';
import { SubComment } from '@app/shared/models/sub-comment';
import { HelperService } from '../helper/helper.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private helperService: HelperService
  ) { }

  getLikes(postId: string, t: number) {
    return this.db.collectionGroup('likes', ref => ref.where('postId', '==', postId).orderBy('type')).get();
  }

  getLikesByUidAndPostId(postId) {
    const {uid} = this.authService.getCurrentUser();
    return this.db.collectionGroup('likes', ref => ref.where('postId', '==', postId).where('user.uid', '==', uid).orderBy('type')).get();
  }

  getLikesByUid() {
    const {uid} = this.authService.getCurrentUser();
    return this.db.collectionGroup('likes', ref => ref.where('user.uid', '==', uid).orderBy('type')).get();
  }

  addLike(dataId: string, like: Like) {
    const { uid } = this.authService.getCurrentUser();
    const likeId = this.db.createId();
    const likeDTO = this.cleanUndefined(like);
    likeDTO.likeId = likeId;
    const query = this.db.doc(`user-activities/${uid}/likes/${likeId}`).set(likeDTO);
    return of(likeDTO);
  }

  removeLike(likeId, data, t: number) {
    const { uid } = this.authService.getCurrentUser();
    const query = this.db.doc(`user-activities/${uid}/likes/${likeId}`).delete();
    return of(query);
  }

  removeLikes(dataId: string, type: number) {
    const likeCollection = this.db.collection<Post>('posts').doc(dataId).collection<Like>('likes');
    const query = this.helperService.deleteCollection(likeCollection);
    // return query;
  }

  getLikesByType(dataId: string, t: number) {
    const type = this.getType(t);
    const query = this.db.collection(type).doc(dataId).collection<Like>('likes');
    return query;
  }

  getLikesByData(dataId: string, t: number) {
    const type = this.getType(t);
    const { uid } = this.authService.getCurrentUser();
    this.logger.info('#### dataID', dataId);
    const query = this.db.collection<Post | Comment | SubComment>(type).doc(dataId)
      .collection('likes', ref => ref.where('user.uid', '==', uid));
    return query;
  }


  getLikesRef(data, t: number) {
    const path = this.getPath(data, t);
    const id = this.getId(data, t);
    return this.db.collection(path).doc(id).collection<Like>('likes');
  }


  getType(type: number): string {
    return type === 1 ? 'posts' : type === 2 ? 'comments' : 'sub-comments';
  }

  getPath(data, t: number): string {
    const { postId, commentId, subCommentId } = data;
    if (t === 1) {
      return `/posts/`;
    } else if (t === 2) {
      return `posts/${postId}/comments/`;
    } else {
      return `posts/${postId}/comments/${commentId}/sub-comments/`;
    }
  }

  getId(data, type: number) {
    if (type === 1) {
      return data.postId;
    } else if (type === 2) {
      return data.commentId;
    } else {
      return data.subCommentId;
    }
  }

  // HELPER
  cleanUndefined(dto) {
    const keys = Object.keys(dto);
    keys.forEach(cur => {
      if (!dto[cur]) {
        delete dto[cur];
      }
    });
    return dto;
  }
}
