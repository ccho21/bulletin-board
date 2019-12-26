import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Post } from '@app/shared/models/post';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { CommentService } from '@app/core/services/comment/comment.service';
import { Comment } from '@app/shared/models/comment';
import { PostStateService } from '@app/containers/posts/post-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fln-comment',
  templateUrl: './fln-comment.component.html',
  styleUrls: ['./fln-comment.component.scss']
})
export class FlnCommentComponent implements OnInit, OnDestroy {
  commentForm: FormControl
  @Input() comment: Comment;
  @Output() commentEmit: EventEmitter<any> = new EventEmitter();
  
  replySubscription : Subscription
  
  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private commentService: CommentService,
    private postStateService: PostStateService
  ) { }

  ngOnInit() {
    this.logger.info(this.comment);
    this.commentForm = new FormControl('');
   
    this.postStateService.getReplyDTO().subscribe(res => {
      this.logger.info('### REPLY!!!', res);
      const userNameTag = `@${res.author.displayName} `;
      this.commentForm.patchValue(userNameTag);
    })
  }
  
  onSubmit() {
    if (!this.commentForm.valid) {
      return;
    }
    const comment = this.commentForm.value;
    const author: User = this.authService.getCurrentUser();
    const commentDTO: Comment = {
      author,
      comment,
      createdAt: new Date().toISOString(),
    };
    this.logger.info('###comment DTO ready to go', commentDTO);
    this.postStateService.updateCommentDTO(commentDTO);
    this.commentForm.reset();
  }

  ngOnDestroy() {
    if(this.replySubscription) {
      this.replySubscription.unsubscribe();
    }
  }
}
