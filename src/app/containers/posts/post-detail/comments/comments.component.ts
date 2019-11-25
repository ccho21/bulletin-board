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
  updatedCommentList = [];
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
    const data = changes.post.currentValue;
    if (data) {
      this.commentList = data.comments;
      this.post = data;
      this.isLiked(this.post);
    }
  }
  isLiked(post) {
    this.likeService.isCommentLiked(post.postId, 2).subscribe((results: Like[]) => {
      this.logger.info('### isLiked ', results);
      const { uid } = this.authService.getCurrentUser();
      this.likeService.getLikesBypostId(this.post.postId, 2).subscribe(res => {
        this.updatedCommentList = this.commentList.map((cur: any) => {
          this.logger.info('### get likes by post id', cur);
          if(cur.author.uid === uid) {
            cur.isLiked = true;
          }
          else {
            cur.isLiked = false;
          }
          return cur;
        });
      })
     
    
      this.logger.info('### updated comment list', this.updatedCommentList);
    })
  }

  addLike(data) {
    // go to remove like if it is already there
    if (data.isLiked) {
      this.deleteLike(data);
      return;
    }
    const comment = this.cleanUp(data);
    const user = this.getCurrentUser();
    const postId = this.post.postId;
    const likeDTO: Like = {
      type: 2,
      comment,
      user,
      postId,
    }

    this.likeService.addLike(likeDTO).subscribe(res => {
      this.logger.info('### successfully liked ');
      data.isLiked = true;
    });
  }
  deleteLike(comment) {
    this.likeService.deleteLike(comment.commentId, 2).subscribe(res => {
      this.logger.info('### like successfully deleted');
      comment.isLiked = false;
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
      if (res) {
        this.comment = res;
        this.logger.info('will be emitted', this.commentEmit)
        this.commentEmit.emit(this.comment);
      }
    })
  }
}
