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
import { ViewService } from '@app/core/services/view/view.service';
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
  hasPost: boolean;
  hasImage: boolean;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private logger: LoggerService,
    private authService: AuthService,
    private userService: UserService,
    private likeService: LikeService,
    private viewService: ViewService
  ) { }

  ngOnInit() {
    if (!this.post) {
      this.getPost();
    }
  }

  getPost(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id)
      .subscribe((data: any) => {
        this.post = data.payload.data() as Post;
        if(this.post.photoURL) {
          this.hasImage = true;
        }
        this.hasPost = true;
        // this.isLiked();
        this.viewService.checkViewed(this.post);
      });
  }


  // commentEmit(e) {
  //   const comment = e;
  //   this.logger.info('### update Post', this.post);
  //   this.logger.info(this.post.hasOwnProperty('comments'));
  //   if (this.post.hasOwnProperty('comments')) {
  //     this.post.comments.push(comment);
  //   }
  //   else {
  //     this.post.comments = [comment];
  //   }
  //   this.updatePost(this.post);
  // }

  
  isLiked() {
    this.likeSubscription = this.likeService.isLiked(this.post.postId, 1).subscribe((res: Like) => {
      this.isPostLiked = res ? true : false;
      this.logger.info('### isPostlike', this.isPostLiked);
    })
  }

  updatePost(post) {
    this.postService.updatePost(post.postId, post).subscribe(res => {
      this.logger.info('### post is successfully updated', res);
    });
  }

  
  getCurrentUser() {
    // Author
    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const user: User = { displayName, uid, photoURL, email, emailVerified };
    return user;
  }

  
  ngOnDestroy() {
    this.likeSubscription.unsubscribe();
  }
}
