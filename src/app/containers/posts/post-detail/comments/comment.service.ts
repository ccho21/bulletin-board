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

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private db: AngularFirestore, private logger: LoggerService) { }
  addComment(comment: Comment) {
    return from(this.db.collection('comments').add(comment)).pipe(
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
