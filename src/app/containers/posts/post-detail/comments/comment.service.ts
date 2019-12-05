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
      .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments').valueChanges(['added', 'removed']);
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
    return from(this.db
      .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments').doc(commentId)
      .set(commentDTO)).subscribe();
  }

  deleteComment(postId: string, comment: Comment) {
    const query = this.db
      .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments').doc(comment.commentId).delete();
    return of(query);
  }

  getNumOfComments(postId: string) {
    return this.db
      .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments').valueChanges().pipe(mergeMap(res => {
        return of(res.length);
      }));;
  }
}
