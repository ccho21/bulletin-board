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
import { SubComment } from '@app/shared/models/sub-comment';
import { SubCommentService } from '@app/containers/posts/post-detail/comments/sub-comment.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService,
    private subCommentService: SubCommentService
  ) { }

  addLike(dataId: string, like: Like, type: number, dataDTO) {
    this.logger.info('how many times called?');
    const id = this.db.createId();
    const likeDTO = this.cleanUndefined(like);
    likeDTO.likeId = id;

    const query = this.db.collection<Like>('likes').doc(id).set(likeDTO);
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
        else if (type === 2) {
          const commentDTO: Comment = { ...dataDTO };
          const likeId = likeDTO.likeId;
          commentDTO.likes.push(likeId);
          this.logger.info('### Comment DTO', commentDTO);
          this.commentService.updateComment(commentDTO.postId, commentDTO.commentId, commentDTO);
          return of(res);
        }
        else {
          const subCommentDTO: SubComment = { ...dataDTO };
          const likeId = likeDTO.likeId;
          subCommentDTO.likes.push(likeId);
          this.logger.info('### subCommentDTO ', subCommentDTO);
          this.subCommentService.updateSubComment(subCommentDTO.commentId, subCommentDTO);
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
    const q = type === 1 ? 'postId' : type === 2 ? 'commentId' : 'subCommentId';
    this.logger.info('### QQQ', q);
    this.logger.info('### data ID ', dataId);
    const query = this.db.collection('likes', ref =>
      ref.where('type', '==', type).where(q, '==', dataId).where('user.uid', '==', uid)).valueChanges();
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

  getLikesByUid(uid) {
    return this.db
      .collection<Like>('likes', ref =>
        ref.where('user.uid', '==', uid)).valueChanges();
  }
}
