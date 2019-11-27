import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { UploadService } from '@app/core/services/upload/upload.service';
import { CommentService } from './comment.service';
import { User } from '@app/shared/models/user';
import { PostService } from '../../shared/post.service';
import { Post } from '../../../../shared/models/post';
import { LikeService } from '@app/core/services/like/like.service';
import { UserService } from '@app/core/services/user/user.service';
import { Like } from '@app/shared/models/like';
import { Comment } from '@app/shared/models/comment';
import { take } from 'rxjs/operators';
import { ModalService } from '@app/core/services/modal/modal.service';
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
  addCommentValid: boolean;
  @Input() post: Post;
  @Output() commentEmit: EventEmitter<Comment> = new EventEmitter();
  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private uploadService: UploadService,
    private commentService: CommentService,
    private postService: PostService,
    private likeService: LikeService,
    private userService: UserService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.commentForm = new FormControl('');
    this.logger.info('### ngOnInit in comments');
  }
  ngOnChanges(changes: SimpleChanges) {
    const data = changes.post.currentValue;
    this.logger.info('### ng change', data);
    if (data) {
      this.commentList = data.comments;
      this.post = data;
      this.isLiked(this.post);
    }
  }

  // *** LIKE *** // 
  isLiked(post) {
      const { uid } = this.authService.getCurrentUser();
      this.likeService.getLikesBypostId(post.postId, uid , 2).pipe(take(1)).subscribe(results => {
        // O(N+M)
        if(this.commentList) {
          this.updatedCommentList = this.commentList.map((comment: Comment) => {
            const valid = results.some((like: Like) => comment.commentId === like.comment.commentId);
            return {...comment, isLiked: valid};
          });
        }
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
  
  //  ***  SUBMIT ***
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

  // *** SUB COMMENTS ***
  updateSubcomment(e) {
    this.logger.info('should be?', e);
    this.commentEmit.emit(e);
  }

  addReply(comment) {
    this.logger.info('comment', comment);
    comment.addCommentValid = !comment.addCommentValid;
  }

  // *** HELPER *** 
  getCurrentUser() {
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
}
