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
@Component({
  selector                : 'app-fln-like',
  templateUrl             : './fln-like.component.html',
  styleUrls               : ['./fln-like.component.scss']
})
export class FlnLikeComponent implements OnInit, OnChanges {
  mode : MODE;
  constructor(
    private route         : ActivatedRoute,
    private postService   : PostService,
    private logger        : LoggerService,
    private authService   : AuthService,
    private userService   : UserService,
    private likeService   : LikeService,
    private viewService   : ViewService
  ) { }
  isLiked;
  data : Post | Comment;
  type: number;
  user: User;
  @Input() post: Post;
  @Input() comment: Comment;
  
  ngOnInit() {
   
  }
  ngOnChanges() {
    this.initData();
    const id = this.getId();
    this.likeService.isLiked(id, this.type).subscribe(res => {
      this.logger.info('like returned', res);
      this.isLiked = res;
    });
  }
  initData() {
    this.user = this.authService.getCurrentUser();
    if(this.post) {
      this.data = this.post;
      this.mode = MODE.POST;
      this.type = 1;
    }
    if(this.comment) {
      this.data = this.comment;
      this.mode = MODE.COMMENT;
      this.type = 2;
    }
  }
  checkLike() {
    const data = this.data;
    // go to remove like if it is already there
    this.logger.info('### isLiked', this.isLiked);
    this.logger.info('### data', this.data);
    this.logger.info('### type', this.type);
    this.logger.info('### mode', this.mode);
    if (this.isLiked) {
      this.deleteLike(data);
      return;
    } else {
      this.addLike(data);
      return ;
    }
  }
  createPostDTO(post) : Like {
    return {
      type                : 1,
      postId: post.postId,
      user: this.user
    }
  }
  createCommentDTO(comment): Like {
    return {
      type                : 2,
      commentId: comment.commentId,
      postId: comment.postId,
      user: this.user
    }
  }
  addLike(data) {
    let dto: Like;
    if(this.mode === MODE.COMMENT) {
      dto = this.createCommentDTO(data);
    }
    else {
      dto = this.createPostDTO(data);
    }

    this.logger.info('### likeDTO', dto);
    this.likeService.addLike(dto).subscribe(_ => {
      this.logger.info('### like successfully added');
    });
  }
  
  deleteLike(data) {
    const id = this.getId();
    this.likeService.deleteLike(id, this.type).subscribe(_ => {
      this.logger.info('### like successfully deleted');
    });
  }

  cleanUp(data) {
    const copiedData      = Object.assign({}, data);
    if (copiedData.hasOwnProperty('author')) {
      delete copiedData.author;
    }
    return copiedData;
  }
  getId() {
    return this.type === 1 ? this.post.postId : this.comment.commentId;
  }
}

enum MODE {
  COMMENT = 'COMMENT',
  POST = 'POST'
}