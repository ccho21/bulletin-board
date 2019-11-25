import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../shared/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Observable, from, Subscription } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { UserService } from '@app/core/services/user/user.service';
import { LikeService } from '@app/core/services/like/like.service';
import { Like } from '@app/shared/models/like';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: Post;
  user: User;
  isPostLiked: boolean;
  likeSubscription: Subscription
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private logger: LoggerService,
    private authService: AuthService,
    private userService: UserService,
    private likeService: LikeService
  ) { }

  ngOnInit() {
    if (!this.post) {
      this.getPost();
    }

    //is liked?
  }
  getPost(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id)
      .subscribe((data: any) => {
        this.post = data.payload.data() as Post;
        this.isLiked();
      });
  }
  isLiked() {
   this.likeSubscription = this.likeService.isLiked(this.post.postId, 1).subscribe((res: Like) => {
      this.isPostLiked = res ? true : false;
      this.logger.info('### isPostlike', this.isPostLiked);
    })
  }

  getCurrentUser() {
    // Author
    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const user: User = { displayName, uid, photoURL, email, emailVerified };
    return user;
  }
  commentEmit(e) {
    const comment = e;
    this.logger.info('### update Post', this.post);
    this.logger.info(this.post.hasOwnProperty('comments'));
    if (this.post.hasOwnProperty('comments')) {
      this.post.comments.push(comment);
    }
    else {
      this.post.comments = [comment];
    }
    this.updatePost(this.post);
  }
  updatePost(post) {
    this.postService.updatePost(post.postId, post).subscribe(res => {
      this.logger.info('### post is successfully updated', res);
    });
  }
  addLike() {
    // go to remove like if it is already there
    if (this.isPostLiked) {
      this.deleteLike();
      return;
    }
    const post = this.cleanUp(this.post);
    const user = this.getCurrentUser();
    const likeDTO: Like = {
      type: 1,
      post,
      user
    }
    this.likeService.addLike(likeDTO).subscribe(res => {
      this.logger.info('### successfully liked ');
    });
  }
  deleteLike() {
    this.logger.info('### delete like start');
    this.likeService.deleteLike(this.post.postId, 1).subscribe(res => {
      this.logger.info('### like successfully deleted');
    });
  }
  cleanUp(data) {
    const copiedData = Object.assign({}, data);
    if (copiedData.hasOwnProperty('comments')) {
      delete copiedData.comments;
      delete copiedData.author;
    }
    return copiedData;
  }
  ngOnDestroy() {
    this.likeSubscription.unsubscribe();
  }
}
