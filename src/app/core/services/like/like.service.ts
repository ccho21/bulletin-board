import { Injectable } from '@angular/core';
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
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
  isLiked(data: Post | Comment | SubComment, t: number) { // get data from current User Id and match with post id. 
    const dataId = this.getId(data, t);
    const path = this.getPath(data, t);
    const query = this.db
    .collection<Post | Comment | SubComment>(path).doc(dataId)
    .collection<Like>('likes').get()
    .pipe(take(1));
    return query;
  }

  addLike(dataId: string, like: Like, t: number, dataDTO: Post | Comment | SubComment) {
    const likeId = this.db.createId();
    const likeDTO = this.cleanUndefined(like);
    const path = this.getPath(like, t);
    likeDTO.likeId = likeId;

    const query = this.db
      .collection<Post | Comment | SubComment>(path).doc(dataId)
      .collection<Like>('likes').doc(likeId).set(likeDTO);
    return of(query);
  }

  removeLike(likeId, data, t: number) {
    this.logger.info('likeId to DELETE ###', likeId);
    const path = this.getPath(data, t);
    const dataId = this.getId(data, t);
    
    const query = this.db
      .collection<Post | Comment | SubComment>(path).doc(dataId)
      .collection<Like>('likes').doc(likeId).delete();
    return from(query);
  }
  
  removeLikes(dataId: string, type: number) {
    const likeCollection = this.db.collection<Post>('posts').doc(dataId).collection<Like>('likes');
    const query = this.helperService.deleteCollection(likeCollection);
    // return query;
  }

  getLikesByType(dataId: string, t: number) {
    const type = this.getType(t);
    const query = this.db.collection<Post | Comment | SubComment>(type).doc(dataId).collection<Like>('likes');
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

  getLikes(postId: string, t: number) {
    return this.db.collectionGroup('likes', ref => ref.where('postId', '==', postId).orderBy('type')).get();
  }

  getLikesByUid() {
    const {uid} = this.authService.getCurrentUser();
    return this.db.collectionGroup('likes', ref => ref.where('user.uid', '==', uid).orderBy('type')).get();
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
      return `/posts/`
    }
    else if (t === 2) {
      return `posts/${postId}/comments/`
    }
    else {
      return `posts/${postId}/comments/${commentId}/sub-comments/`
    }
  }

  getId(data, type: number) {
    if (type === 1) {
      return data.postId;
    }
    else if (type === 2) {
      return data.commentId;
    }
    else {
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
    })
    return dto;
  }
}
/*  getLikesByData(dataId: string, type) {
    const { uid } = this.authService.getCurrentUser();
    const q = type === 1 ? 'postId' : type === 2 ? 'commentId' : 'subCommentId';
    const query = this.db.collection('likes', ref =>
      ref.where('type', '==', type).where(q, '==', dataId).where('user.uid', '==', uid));
    return query;
  } */

/* addLike(dataId: string, like: Like, type: number, dataDTO) {
 this.logger.info('how many times called?');
 const id = this.db.createId();
 const likeDTO = this.cleanUndefined(like);
 likeDTO.likeId = id;

 const query = this.db.collection<Post>('posts').doc(dataId).collection<Like>('likes').doc(id).set(likeDTO);
 return of(query).pipe(
   switchMap(res => {
     if (type === 1) {
       const postDTO: Post = dataDTO;
       postDTO.likes.push(likeDTO);
       this.logger.info('### post DTO ', dataDTO);
       this.postService.updatePost(postDTO.postId, postDTO);
       return of(res);
     }
     else if (type === 2) {
       const commentDTO: Comment = { ...dataDTO };
       commentDTO.likes.push(likeDTO);
       this.logger.info('### Comment DTO', commentDTO);
       this.commentService.updateComment(commentDTO.postId, commentDTO.commentId, commentDTO);
       return of(res);
     }
     else {
       const subCommentDTO: SubComment = { ...dataDTO };
       subCommentDTO.likes.push(likeDTO);
       this.logger.info('### subCommentDTO ', subCommentDTO);
       this.subCommentService.updateSubComment(subCommentDTO.commentId, subCommentDTO);
       return of(res);
     }
   })
 )
} */

/* removeLike(dataId: string, type: number, dataDTO) {
  const query = this.getLikesByData(dataId, type).get().pipe(mergeMap(res => res.docs), take(1),
    mergeMap((like: any) => {
      return of(this.db.collection('likes').doc(like.data().likeId).delete()).pipe(
        switchMap(res => {
          if (type === 1) {
            const postDTO: Post = { ...dataDTO };
            const lIndex = postDTO.likes.findIndex(cur => cur === like.likeId);
            postDTO.likes.splice(lIndex, 1);
            this.logger.info('### post DTO to delet', postDTO);
            this.postService.updatePost(postDTO.postId, postDTO);
            return of(res);
          }
          else if (type === 2) {
            const commentDTO: Comment = { ...dataDTO };
            const lIndex = commentDTO.likes.findIndex(cur => cur === like.likeId);
            commentDTO.likes.splice(lIndex, 1);
            this.logger.info('### Comment DTO to delet', commentDTO);
            this.commentService.updateComment(commentDTO.postId, commentDTO.commentId, commentDTO);
            return of(res);
          }
          else {
            const subCommentDTO: SubComment = { ...dataDTO };
            const lIndex = subCommentDTO.likes.findIndex(cur => cur === like.likeId);
            subCommentDTO.likes.splice(lIndex, 1);
            this.logger.info('### subCommentDTO  to delete', subCommentDTO);
            this.subCommentService.updateSubComment(subCommentDTO.commentId, subCommentDTO);
            return of(res);
          }
        })
      )
    }));
  return query;
} */
