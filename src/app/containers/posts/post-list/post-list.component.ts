import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../shared/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Post } from '../../../shared/models/post';
import { LikeService } from '@app/core/services/like/like.service';
import { mergeMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Like } from '@app/shared/models/like';
import { User } from '@app/shared/models/user';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  likeSubscription: Subscription
  posts: Array<Post> = [];
  isPostLiked;
  constructor(
    private logger: LoggerService,
    private postService: PostService,
    private likeService: LikeService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.postService.getPosts().subscribe(res => {
      this.logger.info('is this called again?');
      const data = res;
      if (data.length) {
        this.posts = data as Post[];
      }
    });
  }
  isLiked(data) {
    return this.likeService.isLiked(data.postId, 1);
  }

  addLike(data) {
    this.isLiked(data).subscribe((res: Like) => {
      this.isPostLiked = res ? true : false;
      this.logger.info('### isPostlike', this.isPostLiked);

      const post = this.cleanUp(data);
      const user = this.getCurrentUser();
      const likeDTO: Like = {
        type: 1,
        post,
        user
      }
      // go to remove like if it is already there
      if (this.isPostLiked) {
        this.deleteLike(data).pipe(mergeMap(res =>{
          return this.postService.updatePostLikes(data, -1);
        })).subscribe(_ => {
          this.logger.info('### successfully deleted ');
        });
        return;
      }

      this.likeService.addLike(likeDTO).pipe(mergeMap(res =>{
        return this.postService.updatePostLikes(data, 1);
      })).subscribe(_ => {
        this.logger.info('### successfully liked ');
      });
    });
  }

  getCurrentUser() {
    // Author
    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const user: User = { displayName, uid, photoURL, email, emailVerified };
    return user;
  }

  deleteLike(data) {
    return this.likeService.deleteLike(data.postId, 1);
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
    // this.likeSubscription.unsubscribe();
  }
}
