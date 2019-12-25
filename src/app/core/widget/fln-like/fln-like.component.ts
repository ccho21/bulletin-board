import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Observable, from, Subscription } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { LikeService } from '@app/core/services/like/like.service';
import { Like } from '@app/shared/models/like';
import { UserActivitiesService } from '@app/core/services/user-activities/user-activities.service';
import { Comment } from '@app/shared/models/comment';
import { SubComment } from '@app/shared/models/sub-comment';
import { PostStateService } from '@app/containers/posts/post-state.service';
@Component({
  selector                          : 'app-fln-like',
  templateUrl                       : './fln-like.component.html',
  styleUrls                         : ['./fln-like.component.scss']
})
export class FlnLikeComponent implements OnInit, OnDestroy {
  mode                              : MODE;
  constructor(
    private route                   : ActivatedRoute,
    private logger                  : LoggerService,
    private authService             : AuthService,
    private likeService             : LikeService,
    private userActivitiesService   : UserActivitiesService,
    private postStateService        : PostStateService
  ) { }
  isLiked;
  likeId                            : string;
  data;
  type                              : number;
  user                              : User;
  likeSubscription                  : Subscription;
  like                              : Like;
  isPost                            : boolean;
  @Input() post                     : Post;
  @Input() comment                  : Comment;
  @Input() subComment               : SubComment;
  ngOnInit() {
    this.initData();
    this.checkLiked();
  }

  initData() {
    this.user                       = this.authService.getCurrentUser();
    if (this.post) {
      this.data                     = this.post;
      this.mode                     = MODE.POST;
      this.type                     = 1;
      this.isPost                   = true;
    }
    if (this.comment) {
      this.data                     = this.comment;
      this.mode                     = MODE.COMMENT;
      this.type                     = 2;
    }
  }

  checkLiked() {
    this.isLiked = this.data.isLiked ? true : false;
  }

  clickLike() {
    const data                      = this.data;
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
      type                          : 1,
      postId                        : post.postId,
      user                          : this.user
    }
  }

  createCommentDTO(comment): Like {
    return {
      type                          : 2,
      commentId                     : comment.commentId,
      postId                        : comment.postId,
      user                          : this.user
    }
  }

  createSubCommentDTO(subComment): Like {
    return {
      type                          : 3,
      subCommentId                  : subComment.subCommentId,
      commentId                     : subComment.commentId,
      postId                        : subComment.postId,
      user                          : this.user
    }
  }

  addLike(data) {
    let dto                         : Like = this.getDTO(data);
    const dataDTO                   = { ...data };
    const dataId                    = this.getId();
    this.likeService.addLike(dataId, dto, this.type, dataDTO).subscribe(res => {
      this.logger.info('### like successfully added');
      this.isLiked = res;
    });
  }

  removeLike(data) {
    const likeId                    = data.isLiked.likeId;
    this.logger.info('### like id', likeId);
    this.likeService.removeLike(likeId, this.data, this.type).subscribe(res => {
      this.logger.info('### like removed', res);
      this.isLiked = null;
    });
  }

  cleanUp(data) {
    const copiedData                = Object.assign({}, data);
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
  COMMENT                           = 'COMMENT',
  POST                              = 'POST',
  SUB_COMMENT                       = 'SUB_COMMENT'
}