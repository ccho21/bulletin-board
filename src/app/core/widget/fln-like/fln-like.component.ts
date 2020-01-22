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
  mode: MODE;
  constructor(
    private route: ActivatedRoute,
    private logger: LoggerService,
    private authService: AuthService,
    private likeService: LikeService,
    private userActivitiesService: UserActivitiesService,
    private postStateService: PostStateService
  ) { }
  isLiked;
  likeId: string;
  data;
  type: number;
  user: User;
  likeSubscription: Subscription;
  like: Like;
  isPost: boolean;
  @Input() post: Post;
  @Input() comment: Comment;
  @Input() subComment: SubComment;
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
    this.isLiked = this.data.isLiked ? this.data.isLiked : null;
  }

  clickLike() {
    const data                      = this.data;
    // go to remove like if it is already there
    this.logger.info('### isLiked', this.isLiked);
    this.logger.info('### data', this.data);
    this.logger.info('### type', this.type);
    this.logger.info('### mode', this.mode);
    if (this.isLiked) {
      this.removeLike(this.isLiked);
      return;
    } else {
      this.addLike(data);
      return;
    }
  }


  addLike(data) {
    const dto: Like = this.getDTO(data);
    const dataId                    = this.getId();
    this.likeService.addLike(dataId, dto).subscribe(res => {
      this.logger.info('### like successfully added', res);
      this.isLiked = res;
      if (this.data.hasOwnProperty('likes')) {
        this.data.likes.push({...res});
      } else {
        this.data.likes = [{...res}];
      }
      this.postStateService.setPost(this.data);
    });
  }

  removeLike(isLiked) {
    const likeId                    = isLiked.likeId;
    this.likeService.removeLike(likeId, this.data, this.type).subscribe(res => {
      this.logger.info('### like removed', this.data);
      const likeIndex = this.data.likes.findIndex(like => like.likeId === likeId);
      this.data.likes.splice(likeIndex, 1);
      this.isLiked = null;
      this.postStateService.setPost(this.data);
    });
  }

  ngOnDestroy() {
    this.logger.info('########### fln-like destroyed');
    if (this.likeSubscription) {
      this.likeSubscription.unsubscribe();
    }
  }
  /* HELPER */
  getDTO(data) {
    if (this.mode === MODE.COMMENT) {
      return this.createCommentDTO(data);
    } else if (this.mode === MODE.POST) {
      return this.createPostDTO(data);
    }
  }

  getId() {
    if (this.mode === MODE.COMMENT) {
      return this.comment.commentId;
    } else if (this.mode === MODE.POST) {
      return this.post.postId;
    }
  }

  createPostDTO(post): Like {
    return {
      type                          : 1,
      postId                        : post.postId,
      user                          : this.user
    };
  }

  createCommentDTO(comment): Like {
    const dto: Like  = {
      type                          : 2,
      commentId                     : comment.commentId,
      postId                        : comment.postId,
      user                          : this.user
    };
    if (comment.hasOwnProperty('commentTo')) {
      dto.pCommentId = comment.commentTo.commentId;
    }
    return {...comment};
  }
}

enum MODE {
  COMMENT                           = 'COMMENT',
  POST                              = 'POST',
  SUB_COMMENT                       = 'SUB_COMMENT'
}
