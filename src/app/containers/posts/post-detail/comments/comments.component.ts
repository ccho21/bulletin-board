import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { UploadService } from '@app/core/services/upload/upload.service';
import { CommentService } from './comment.service';
import { User } from '@app/shared/models/user';
import { PostService } from '../../shared/post.service';
import { Post } from '../../../../shared/models/post';
import { Comment } from '../../../../shared/models/comment';
import { LikeService } from '@app/core/services/like/like.service';
import { UserService } from '@app/core/services/user/user.service';
import { Like } from '@app/shared/models/like';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnChanges {
  commentForm: FormControl;
  comment: Comment;
  commentList: Comment[] = [];
  isCommentLiked: boolean;
  @Input() post: Post;
  @Output() commentEmit: EventEmitter<Comment> = new EventEmitter();
  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private uploadService: UploadService,
    private commentService: CommentService,
    private postService: PostService,
    private likeService: LikeService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.commentForm = new FormControl('');
  }
  ngOnChanges(changes: SimpleChanges) {
    this.logger.info('#### changes', changes);
    const data = changes.post.currentValue;
    if(data) {
      this.commentList = data.comments;
    }
  }
  // isLiked() {
  //   this.likeSubscription = this.likeService.isLiked(this.post.postId, 1).subscribe((res: Like) => {
  //      this.like = res;
  //      this.isPostLiked = this.like ? true : false;
  //      this.logger.info('### isPostlike', this.isPostLiked);
  //      this.logger.info('### this.like', this.like);
  //    })
  //  }
  
  addLike(data) {
    // go to remove like if it is already there
    if (this.isCommentLiked) {
      this.deleteLike(data);
      return;
    }
    const comment = this.cleanUp(data);
    const user = this.getCurrentUser();
    const likeDTO: Like = {
      type: 2,
      comment,
      user
    }
    this.likeService.addLike(likeDTO).subscribe(res => {
      this.logger.info('### successfully liked ');
      this.isCommentLiked = true;
    });
  }
  deleteLike(comment) {
    this.logger.info('### delete like start');
    this.likeService.deleteLike(comment).subscribe(res => {
      this.logger.info('### like successfully deleted');
      this.isCommentLiked = false;
    });
  }
  getCurrentUser() {
    // Author
    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const user: User = { displayName, uid, photoURL, email, emailVerified };
    return user;
  }
  cleanUp(data) {
    const copiedData = Object.assign({}, data);
    if (copiedData.hasOwnProperty('author')) {
      delete copiedData.author;
    }
    return copiedData;
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
      }
    })
  }
}
