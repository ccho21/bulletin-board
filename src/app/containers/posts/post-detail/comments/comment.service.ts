import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of, forkJoin } from "rxjs";
import { AuthService } from "@app/core/services/auth/auth.service";
import { mergeMap, concatMap, finalize } from "rxjs/operators";
import { Comment } from "../../../../shared/models/comment";
import { Post } from '@app/shared/models/post';
import { Like } from '@app/shared/models/like';
import { SubComment } from '@app/shared/models/sub-comment';
import { HelperService } from '@app/core/services/helper/helper.service';

@Injectable({
  providedIn: "root"
})
export class CommentService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private helperService: HelperService
  ) { }

  getComments(postId) {
    return this.db
      .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments').get();
  }

  addComment(postId, commentDTO: Comment) {
    const id = this.db.createId();
    // Post detail
    commentDTO.commentId = id;
    const query = this.db
      .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments').doc(commentDTO.commentId).set(commentDTO);
    return of(query);
  }
  updateComment(postId: string, commentId: string, commentDTO: Comment) {
    const query = this.db
      .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments').doc(commentId)
      .update(commentDTO);
    return of(query);
  }

  deleteComment(postId: string, comment: Comment) {
    this.logger.info('### yo');
    const ref = this.db
      .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments').doc(comment.commentId);
      
    const query = forkJoin([
      from(this.helperService.deleteCollection(ref.collection<SubComment>('sub-comments'))),
      from(this.helperService.deleteCollection(ref.collection<Like>('likes')))
    ]).pipe(
      concatMap(res => {
        this.logger.info('everything is deleted');
        return ref.delete();
      })
    );
    return query;
  }

  getCommentsByUid(uid) {
    return this.db
      // .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments', ref => ref.where('author.uid', '==', uid)).valueChanges();
  }

  getNumOfComments(postId: string) {
    return this.db
      .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments').get();
  }

  comments() {
    return this.db.collection('comments').get();
  }
}
