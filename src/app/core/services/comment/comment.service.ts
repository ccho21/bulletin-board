import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollectionGroup,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { from, of, forkJoin, Observable } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { mergeMap, concatMap, finalize } from 'rxjs/operators';
import { Comment } from '../../../shared/models/comment';
import { Post } from '@app/shared/models/post';
import { Like } from '@app/shared/models/like';
import { SubComment } from '@app/shared/models/sub-comment';
import { HelperService } from '@app/core/services/helper/helper.service';
import { SubCommentService } from '@app/core/services/sub-comment/sub-comment.service';
import { LikeService } from '@app/core/services/like/like.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private helperService: HelperService,
    private subCommentService: SubCommentService,
    private likeService: LikeService
  ) { }

  getComments(postId: string) {
    return this.db
      .collectionGroup<Comment>('comments', ref => ref.where('postId', '==', postId).orderBy('createdAt', 'asc')).get();
  }

  getCommentsByUid(uid) {
    return this.db
      .collectionGroup<Comment>('comments', ref => ref.where('author.uid', '==', uid).orderBy('createdAt')).get();
  }

  getPath(commentDTO) {
    if (commentDTO.depth === 1) {
      return `posts/${commentDTO.postId}/comments/${commentDTO.commentId}`;
    } else {
      return `posts/${commentDTO.postId}/comments/${commentDTO.commentTo.commentId}/comments/${commentDTO.commentId}`;
    }
  }

  addComment(commentDTO: Comment) {
    const id = this.db.createId();
    commentDTO.commentId = id;
    const path = this.getPath(commentDTO);

    const query = from(this.db
      .doc(path).set(commentDTO)).pipe(res => {
        this.logger.info('### success DTO', res);
        return of(commentDTO);
      });
    return query;
  }

  updateComment(postId: string, mainCommentId: string, commentDTO: Comment) {
    /*   const path = this.getPath(postId, mainCommentId);
      const query = this.db
        .collection<Comment>(path).doc(commentDTO.commentId).update(commentDTO);
      return of(query); */
    return of(null);
  }

  deleteComment(comment: Comment) {
    const commentId = comment.commentId;
    this.logger.info(comment);
    const requestList: Array<Promise<number>> = [];
    const commentQuery = this.db
    .collectionGroup<Comment>('comments' , ref => ref.where('commentId', '==', commentId).orderBy('createdAt', 'asc'))
    .get().subscribe(res => {
      this.logger.info(res);
    });
    const likeQuery = this.db
    .collectionGroup<Like>('likes', ref => ref.where('commentId', '==', commentId).orderBy('createdAt', 'asc'))
    .get().subscribe(res => {
      this.logger.info(res);
    });

    if (comment.hasOwnProperty('commentTo')) {
      this.logger.info('### this will not passsed');
      const subCommentQuery = this.db
        .collectionGroup<Comment>('comments', ref => ref.where('commentTo.commentId', '==', commentId).orderBy('createdAt', 'asc'));
      requestList.push(this.helperService.deleteCollection(subCommentQuery));
    }
    requestList.push(this.helperService.deleteCollection(likeQuery));
    requestList.push(this.helperService.deleteCollection(commentQuery));
    const query = forkJoin([requestList]);
    return query;
    // return of(null);
  }
}
