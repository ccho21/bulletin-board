import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { UploadService } from '@app/core/services/upload/upload.service';
import { CommentService } from './comment.service';
import { User } from '@app/shared/models/user';
import { PostService } from '../../shared/post.service';
import { Post } from '../../post';
import { Comment } from './comment';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnChanges {
  commentForm: FormControl;
  comment: Comment;
  commentList: Comment[] = [];
  @Input() post: Post;
  @Output() commentEmit: EventEmitter<Comment> = new EventEmitter();
  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private uploadService: UploadService,
    private commentService: CommentService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.commentForm = new FormControl('');
    this.logger.info('### post comments in comments ###', this.post);
    if(this.post) {
      this.commentList = this.post.comments;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.logger.info('#### changes', changes);
    const data = changes.post.currentValue;
    if(data) {
      this.commentList = data.comments;
    }
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
    const postId = this.post.postId;
    const commentDTO: Comment = {
      postId,
      author,
      comment,
      createdAt: new Date().toISOString(),
    };
    this.commentService.addComment(commentDTO).subscribe(res => {
      this.logger.info('### successfully created a comment ', res);
      if(res) {
        this.comment = res;
        this.logger.info('will be emitted',this.commentEmit)
        this.commentEmit.emit(this.comment);
        
        // if comment created then update post detail
        // if (this.post.comments === null) {
        //   this.post.comments = [this.comment];
        // } else {
        //   this.post.comments.push(this.comment);
        // }
        // this.postService.updatePost(postId, this.post);
      }
    })
  }
}
