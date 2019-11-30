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

@Injectable({
  providedIn: "root"
})
export class CommentService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService
  ) {}

  getComments(postId) {
    return this.db.collection('comments', ref => ref.where('postId', '==', `${postId}`)).valueChanges(['added', 'removed']);
  }

  addComment(commentDTO: Comment) {
    const id = this.db.createId();
    // Post detail
    commentDTO.commentId = id;
    const query = this.db.collection("comments").doc(id).set(commentDTO);
    return of(query);
  }
  updateComment(commentDTO) {

  }

  updateSubComment(sub: Comment, main: Comment) {
    const id = this.db.createId();
    sub.commentId = id;
    if(main.hasOwnProperty('comments')) {
      main.comments.push(sub);
    }
    else {
      main.comments = [sub];
    }
    return from(
      this.db
        .collection("comments")
        .doc(main.commentId)
        .set(main)
    );
  }

  deleteComment(comment) {
    const query = this.db.collection('comments').doc(comment.commentId).delete();
    return of(query);
  }
}
