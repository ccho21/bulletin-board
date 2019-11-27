import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Post } from '@app/shared/models/post';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { CommentService } from '@app/containers/posts/post-detail/comments/comment.service';
import { Comment } from '@app/shared/models/comment';

@Component({
  selector: 'app-fln-comment',
  templateUrl: './fln-comment.component.html',
  styleUrls: ['./fln-comment.component.scss']
})
export class FlnCommentComponent implements OnInit, OnChanges {
  commentForm
  @Input() comment: Comment;
  @Output() subCommentEmit: EventEmitter<any> = new EventEmitter();
  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.commentForm = new FormControl('');
  }
  ngOnChanges(changes: SimpleChanges) {
    this.logger.info(changes);
  }
  onSubmit() {
    if (!this.commentForm.valid) {
      return;
    }
    //comment
    const comment = this.commentForm.value;
    this.logger.info('### form value', this.commentForm.value);
    // Author 
    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const author: User = { displayName, uid, photoURL, email, emailVerified };

    // Post detail
    const commentId = this.comment.commentId;
    const commentDTO: Comment = {
      commentId,
      author,
      comment,
      createdAt: new Date().toISOString(),
    };

    if(this.comment.hasOwnProperty('comments')) {
      this.comment.comments.push(commentDTO);
    } else {
      this.comment.comments = [commentDTO];
    }
    const subComment = Object.assign({}, this.comment);
    this.subCommentEmit.emit(subComment);
    this.logger.info('### successfully updated a comment ', this.comment);
    // this.commentService.updateComment(this.comment).subscribe(res => {
      
      
    // })
  }
}
