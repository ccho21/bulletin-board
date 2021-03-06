import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Post } from '@app/shared/models/post';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { CommentService } from '@app/core/services/comment/comment.service';
import { Comment } from '@app/shared/models/comment';
import { PostStateService } from '@app/components/posts/post-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wgt-comment',
  templateUrl: './wgt-comment.component.html',
  styleUrls: ['./wgt-comment.component.scss']
})
export class WgtCommentComponent implements OnInit, OnDestroy {
  commentForm: FormControl;
  @Input() comment: Comment;
  @Output() commentEmit: EventEmitter<any> = new EventEmitter();

  replySubscription: Subscription;
  userNameTag;
  parentComment: Comment;
  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private commentService: CommentService,
    private postStateService: PostStateService
  ) { }

  ngOnInit() {
    this.commentForm = new FormControl('');

    this.replySubscription = this.postStateService.getReplyDTO().subscribe(res => {
      this.logger.info('### REPLY!!!', res);
      this.userNameTag = `@${res.author.displayName}`;
      this.parentComment = this.cleanUpComments(res);
      this.commentForm.patchValue(`${this.userNameTag} `);
    });
  }

  cleanUpComments(c) {
    const comment = {...c};
    delete comment.comments;
    return comment;
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
      depth: 1,
      comments: [],
    };

    if (this.userNameTag && this.parentComment) {
        if (this.parentComment.hasOwnProperty('commentTo')) {
          commentDTO.commentTo = this.parentComment.commentTo;
          commentDTO.parentCommentId = this.parentComment.parentCommentId;
        } else {
          commentDTO.commentTo = this.parentComment;
          commentDTO.parentCommentId = this.parentComment.commentId;
        }
        commentDTO.commentTag = this.userNameTag;
        commentDTO.depth = 2;
    }

    this.logger.info('###comment DTO ready to go', commentDTO);
    this.postStateService.updateCommentDTO(commentDTO);
    this.commentForm.reset();
  }

  ngOnDestroy() {
    if (this.replySubscription) {
      this.replySubscription.unsubscribe();
    }
  }
}
