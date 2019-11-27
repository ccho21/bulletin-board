import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { mergeMap } from 'rxjs/operators';
import { Comment } from '../../../../shared/models/comment';
import { User } from '@app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private db: AngularFirestore, private logger: LoggerService,
    private authService: AuthService) { }
  addComment(postId: string, comment: Comment) {
    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const author: User = { displayName, uid, photoURL, email, emailVerified };
    const id = this.db.createId();
    // Post detail
    const commentDTO: Comment = {
      commentId: id,
      postId,
      author,
      comment: comment.comment,
      createdAt: new Date().toISOString(),
    };


    return from(this.db.collection('comments').add(commentDTO)).pipe(
      mergeMap(res => {
        comment.commentId = res.id;
        res.set(comment);
        return of(comment);
      })
    );
  }

  updateComment(comment: Comment) {
    return from(this.db
      .collection('comments')
      .doc(comment.commentId)
      .set(comment));
  }
}
