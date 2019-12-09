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
  data: Post | Comment;
  type: number;
  user: User;
  likeSubscription: Subscription;
  @Input() post: Post;
  @Input() comment: Comment;

  ngOnInit() {
    this.logger.info('fln like start');
    this.initData();
    const id = this.getId();
    const dto = this.getDTO(this.data);
    this.likeSubscription = this.likeService.isLiked(dto, id, this.type).subscribe(res => {
      this.logger.info('is liked', res);
      this.isLiked = res;
    });
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
  }
  clickLike() {
    const data = this.data;
    // go to remove like if it is already there
    this.logger.info('### isLiked', this.isLiked);
    this.logger.info('### data', this.data);
    this.logger.info('### type', this.type);
    this.logger.info('### mode', this.mode);
    if (this.isLiked) {
      this.removeLike(data);
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
  addLike(data) {
    let dto: Like = this.getDTO(data);
    let dataDTO: Post;
    dataDTO = {...data};
    const id = this.getId();
    this.likeService.addLike(id, dto, this.type, dataDTO).subscribe(res => {
      this.logger.info('### like successfully added', res);
    });
  }

  getDTO(data) {
    if (this.mode === MODE.COMMENT) {
      return this.createCommentDTO(data);
    }
    else {
      return this.createPostDTO(data);
    }
  }
  removeLike(data) {
    let dto: Like = this.getDTO(data);
    const id = this.getId();
    let dataDTO: Post;
    dataDTO = {...data};
    this.likeService.deleteLike(dto, id, this.type, dataDTO).subscribe(res => {
      this.logger.info('### like successfully deleted', res);
    });
  }

  cleanUp(data) {
    const copiedData = Object.assign({}, data);
    if (copiedData.hasOwnProperty('author')) {
      delete copiedData.author;
    }
    return copiedData;
  }
  getId() {
    return this.type === 1 ? this.post.postId : this.comment.commentId;
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
  POST = 'POST'
}