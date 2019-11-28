import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
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
@Component({
  selector                : 'app-fln-like',
  templateUrl             : './fln-like.component.html',
  styleUrls               : ['./fln-like.component.scss']
})
export class FlnLikeComponent implements OnInit {

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
  @Input() post: Post;
  @Input() comment: Comment;
  @Output() subCommentEmit: EventEmitter<any> = new EventEmitter();
  ngOnInit() {
    
  }
  checkLike() {
    const data = this.post;
    // go to remove like if it is already there
    if (this.isLiked) {
      this.deleteLike();
      return;
    } else {
      this.addLike(data);
    }
   
  }
  addLike(data) {
    const post            = data;
    const user            = this.authService.getCurrentUser();
    const likeDTO: Like = {
      type                : 1,
      postId: post.postId,
      user
    }
    this.logger.info('### likeDTO', likeDTO);
    this.likeService.addLike(likeDTO).subscribe(_ => {
      // this.postService.updatePostLikes(this.post, 1);
      this.logger.info('### successfully liked ');
    });
  }
  deleteLike() {
    this.likeService.deleteLike(this.post.postId, 1).subscribe(res => {
      // this.postService.updatePostLikes(this.post, -1);
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
}
