import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Post } from '@app/shared/models/post';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { CommentService } from '@app/core/services/comment/comment.service';
import { Comment } from '@app/shared/models/comment';

@Component({
  selector: 'app-fln-comment',
  templateUrl: './fln-comment.component.html',
  styleUrls: ['./fln-comment.component.scss']
})
export class FlnCommentComponent implements OnInit {
  commentForm
  @Input() comment: Comment;
  @Output() commentEmit: EventEmitter<any> = new EventEmitter();
  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.logger.info(this.comment);
    this.commentForm = new FormControl('');
   
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
      likes: [],
      createdAt: new Date().toISOString(),
    };
    this.logger.info('###comment DTO ready to go', commentDTO);
    this.commentEmit.emit(commentDTO);
    this.commentForm.reset();
  }
}
