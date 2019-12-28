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
  userNameTag
  parentComment: Comment;
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
      this.userNameTag = `@${res.author.displayName}`;
      this.parentComment = res;
      this.commentForm.patchValue(`${this.userNameTag} `);
    })
  }
  
  onSubmit() {
    if (!this.commentForm.valid) {
      return;
    }
   
    const comment = this.commentForm.value.replace(`${this.userNameTag} `, '');
    const author: User = this.authService.getCurrentUser();
    const commentDTO: Comment = {
      author,
      comment,
      createdAt: new Date().toISOString(),
    };

    if(this.userNameTag && this.parentComment) {
        commentDTO.commentTo = this.parentComment;
        commentDTO.commentTag = this.userNameTag;
        commentDTO.depth = 2;
    }
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
