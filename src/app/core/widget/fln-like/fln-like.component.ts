import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Observable, from, Subscription } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { UserService } from '@app/core/services/user/user.service';
import { LikeService } from '@app/core/services/like/like.service';
import { Like } from '@app/shared/models/like';
import { ViewService } from '@app/core/services/view/view.service';
import { PostService } from '@app/containers/posts/shared/post.service';
import { Comment } from '@app/shared/models/comment';
import { mergeMap } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
import { SubComment } from '@app/shared/models/sub-comment';
@Component({
  selector: 'app-fln-like',
  templateUrl: './fln-like.component.html',
  styleUrls: ['./fln-like.component.scss']
})
export class FlnLikeComponent implements OnInit, OnDestroy {
  mode: MODE;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private logger: LoggerService,
    private authService: AuthService,
    private userService: UserService,
    private likeService: LikeService,
    private viewService: ViewService
  ) { }
  isLiked;
  likeId: string;
  data: Post | Comment | SubComment;
  type: number;
  user: User;
  likeSubscription: Subscription;
  like: Like;
  @Input() post: Post;
  @Input() comment: Comment;
  @Input() subComment: SubComment;
  ngOnInit() {
    this.initData();
    this.checkLiked();
  }

  initData() {
    this.user = this.authService.getCurrentUser();
    if (this.post) {
      this.data = this.post;
      this.mode = MODE.POST;
      this.type = 1;
    }
    if (this.comment) {
      this.data = this.comment;
      this.mode = MODE.COMMENT;
      this.type = 2;
    }

    if (this.subComment) {
      this.data = this.subComment;
      this.mode = MODE.SUB_COMMENT;
      this.type = 3;
    }
  }

  checkLiked() {
    this.likeSubscription = this.likeService.isLiked(this.data, this.type).subscribe(res => {
      if(res.docs.length) {
        this.like = res.docs[0].data() as Like;
        this.isLiked = true;
      } else {
        this.isLiked = false;
      }
      this.logger.info('### LIKE ###', this.like);
    });
  }

  clickLike() {
    const data = this.data;
    // go to remove like if it is already there
    this.logger.info('### isLiked', this.isLiked);
    this.logger.info('### data', this.data);
    this.logger.info('### type', this.type);
    this.logger.info('### mode', this.mode);
    if (this.isLiked) {
      this.removeLike();
      return;
    } else {
      this.addLike(data);
      return;
    }
  }

  createPostDTO(post): Like {
    return {
      type: 1,
      postId: post.postId,
      user: this.user
    }
  }

  createCommentDTO(comment): Like {
    return {
      type: 2,
      commentId: comment.commentId,
      postId: comment.postId,
      user: this.user
    }
  }

  createSubCommentDTO(subComment): Like {
    return {
      type: 3,
      subCommentId: subComment.subCommentId,
      commentId: subComment.commentId,
      postId: subComment.postId,
      user: this.user
    }
  }
  
  addLike(data) {
    let dto: Like = this.getDTO(data);
    const dataDTO = { ...data };
    const dataId = this.getId();
    this.likeService.addLike(dataId, dto, this.type, dataDTO).subscribe(res => {
      this.logger.info('### like successfully added');
      this.checkLiked();
    });
  }

  removeLike() {
    const likeId = this.like.likeId;
    this.likeService.removeLike(likeId, this.data, this.type).subscribe(res => {
      this.logger.info('### like removed', res);
      this.checkLiked();
    })
  }

  cleanUp(data) {
    const copiedData = Object.assign({}, data);
    if (copiedData.hasOwnProperty('author')) {
      delete copiedData.author;
    }
    return copiedData;
  }

  getDTO(data) {
    if (this.mode === MODE.COMMENT) {
      return this.createCommentDTO(data);
    }
    else if (this.mode === MODE.POST) {
      return this.createPostDTO(data);
    }
    else {
      return this.createSubCommentDTO(data);
    }
  }

  getId() {
    if (this.mode === MODE.COMMENT) {
      return this.comment.commentId;
    }
    else if (this.mode === MODE.POST) {
      return this.post.postId;
    }
    else {
      return this.subComment.subCommentId;
    }
  }

  ngOnDestroy() {
    this.logger.info('########### fln-like destroyed');
    if (this.likeSubscription) {
      this.likeSubscription.unsubscribe();
    }
  }
}

enum MODE {
  COMMENT = 'COMMENT',
  POST = 'POST',
  SUB_COMMENT = 'SUB_COMMENT'
}