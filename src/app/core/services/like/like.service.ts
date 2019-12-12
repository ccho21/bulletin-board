import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { of, Observable } from 'rxjs';
import { mergeMap, take, switchMap } from 'rxjs/operators';
import { Like } from '@app/shared/models/like';
import { Post } from '@app/shared/models/post';
import { AuthService } from '../auth/auth.service';
import { PostService } from '@app/containers/posts/shared/post.service';
import { Comment } from '@app/shared/models/comment';
import { CommentService } from '@app/containers/posts/post-detail/comments/comment.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService
  ) { }

  addLike(dataId: string, like: Like, type: number, dataDTO) {
    this.logger.info('how many times called?');
    const id = this.db.createId();
    const likeDTO = this.cleanUndefined(like);
    likeDTO.likeId = id;
    const likeId = likeDTO.likeId;
    // const query = this.getLikeCollectionByType(like, type).collection<Like>('likes').doc(id).set(likeDTO);
    const query = this.db.collection<Like>('likes').doc(id).set(likeDTO);
    // return of(likeDTO);

    return of(query).pipe(
      switchMap(res => {
        if (type === 1) {
          const postDTO: Post = dataDTO;
          const likeId = likeDTO.likeId;
          postDTO.likes.push(likeId);
          this.logger.info('### post DTO ', dataDTO);
          this.postService.updatePost(postDTO.postId, postDTO);
          return of(res);
        }
        else {
          const commentDTO: Comment = { ...dataDTO };
          const likeId = likeDTO.likeId;
          commentDTO.likes.push(likeId);
          this.logger.info('### Comment DTO' , commentDTO);
          this.commentService.updateComment(commentDTO.postId, commentDTO.commentId, commentDTO);
          return of(res);
        }
      })
    )
  }
  isLiked(data, dataId: string, type: number) { // get data from current User Id and match with post id. 
    const query = this.getLikesByData(data, dataId, type).pipe(mergeMap(res => {
      this.logger.info('is Liked data in like service ', res);
      if (res.length) {
        return of(true);
      }
      else {
        return of(false)
      }
    }));
    return query;
  }

  getLikesByData(data: Like, dataId: string, type) {
    const { uid } = this.authService.getCurrentUser();
    const q = type === 1 ? 'postId' : 'commentId';
    // original
    /* this.logger.info('### type is', type, '### id is', q, ': ', dataId);
    const query = this.getLikeCollectionByType(data, type).collection('likes', ref =>
      ref.where('user.uid', '==', uid)).valueChanges(); */

    // temp
    const query = this.db.collection('likes', ref =>
      ref.where(q, '==', dataId).where('user.uid', '==', uid).where('type', '==', type)).valueChanges();
    return query;

  }

  deleteLike(data, dataId: string, type: number, dataDTO) {
    const query = this.getLikesByData(data, dataId, type).pipe(mergeMap(res => res), take(1), 
    mergeMap((like: any) => {
      return of(this.db.collection('likes').doc(like.likeId).delete()).pipe(
        switchMap(res => {
          if (type === 1) {
            const postDTO: Post = { ...dataDTO };
            const lIndex = postDTO.likes.findIndex(cur => cur === like.likeId);
            postDTO.likes.splice(lIndex, 1);
            this.logger.info('### post DTO to delet' , postDTO);
            this.postService.updatePost(postDTO.postId, postDTO);
            return of(res);
          } else {
            const commentDTO: Comment = { ...dataDTO };
            const lIndex = commentDTO.likes.findIndex(cur => cur === like.likeId);
            commentDTO.likes.splice(lIndex, 1);
            this.logger.info('### Comment DTO to delet' , commentDTO);
            this.commentService.updateComment(commentDTO.postId, commentDTO.commentId, commentDTO);
            return of(res);
          }
        })
      )
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

  getLikeCollectionByType(data, type) {
    if (type === 1) {
      return this.db;//.collection<Post>('posts').doc(data.postId);
    }
    if (type === 2) {
      return this.db
        //.collection<Post>('posts').doc(data.postId)
        .collection<Comment>('comments').doc(data.commentId);
    }
  }

  getNumOfLikes(postId: string) {
    return this.db
      // .collection<Post>('posts').doc(postId)
      .collection<Like>('likes', ref =>
        ref.where('postId', '==', postId).where('type', '==', 1)).valueChanges()
      .pipe(mergeMap(res => {
        return of(res.length);
      }));
  }

  getLikesByUid(uid) {
    return this.db
      .collection<Like>('likes', ref =>
        ref.where('user.uid', '==', uid)).valueChanges();
  }
}
