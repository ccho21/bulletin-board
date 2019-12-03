import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Like } from '@app/shared/models/like';
import { Post } from '@app/shared/models/post';
import { AuthService } from '../auth/auth.service';
import { PostService } from '@app/containers/posts/shared/post.service';
import { Reply } from '@app/shared/models/reply';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {

  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private postService: PostService
  ) { }
  
  addReply(comment) {
    const replyId = this.db.createId();
    const { uid } = this.authService.getCurrentUser();
    const postId = comment.postId;
    const commentId = comment.postId;
    const reply = { uid, postId, commentId };
    const query = this.db.collection<Reply>('replies').doc(replyId).set(reply);
    of(query).subscribe(res => {
      this.logger.info('### reply added');
    });
  }

  deleteReply(comment) {
    const replyId = this.db.createId();
    const { uid } = this.authService.getCurrentUser();
    const postId = comment.postId;
    const commentId = comment.postId;
    const reply = { uid, postId, commentId };
    const query = this.db.collection<Reply>('replies').doc(replyId).delete();
    of(query).subscribe(res => {
      this.logger.info('### reply deleted');
    });
  }
}
