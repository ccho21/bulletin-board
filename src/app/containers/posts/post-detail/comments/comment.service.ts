import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of } from "rxjs";
import { AuthService } from "@app/core/services/auth/auth.service";
import { mergeMap } from "rxjs/operators";
import { Comment } from "../../../../shared/models/comment";
import { User } from "@app/shared/models/user";
import { Post } from '@app/shared/models/post';

@Injectable({
  providedIn: "root"
})
export class CommentService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService
  ) { }

  getComments(postId) {
    return this.db
      // .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments', ref => ref.where('postId', '==', postId)).valueChanges(['added', 'removed']);
  }

  addComment(postId, commentDTO: Comment) {
    const id = this.db.createId();
    // Post detail
    commentDTO.commentId = id;
    const query = this.db
      // .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments', ref => ref.where('postId', '==', postId)).doc(commentDTO.commentId).set(commentDTO);
    return of(query);
  }
  updateComment(postId: string, commentId: string, commentDTO: Comment) {
    const query = this.db
      // .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments', ref => ref.where('postId', '==', postId)).doc(commentId)
      .update(commentDTO);
      return of(query);
  }

  deleteComment(postId: string, comment: Comment) {
    const query = this.db
      // .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments', ref => ref.where('postId', '==', postId)).doc(comment.commentId).delete();
    return of(query);
  }

  getNumOfComments(postId: string) {
    return this.db
      // .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments', ref => ref.where('postId', '==', postId)).valueChanges().pipe(mergeMap(res => {
        return of(res.length);
      }));;
  }

  getCommentsByUid(uid) {
    return this.db.collection<Comment>('comments', ref=> ref.where('author.uid', '==', uid)).valueChanges();
  }
}
