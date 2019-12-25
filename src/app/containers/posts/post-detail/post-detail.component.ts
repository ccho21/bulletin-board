import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../core/services/post/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Observable, from, Subscription, pipe, forkJoin, of } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { UserService } from '@app/core/services/user/user.service';
import { LikeService } from '@app/core/services/like/like.service';
import { Like } from '@app/shared/models/like';
import { ViewService } from '@app/core/services/view/view.service';
import { UserActivitiesService } from '@app/core/services/user-activities/user-activities.service';
import { concatMap } from 'rxjs/operators';
import { CommentService } from '@app/core/services/comment/comment.service';
import { PostStateService } from '../post-state.service';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: Post;
  updatedPost;
  user: User;
  isPostLiked: boolean;
  postSubscription: Subscription
  hasPost: boolean;
  hasImage: boolean;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private logger: LoggerService,
    private authService: AuthService,
    private userService: UserService,
    private likeService: LikeService,
    private viewService: ViewService,
    private userActivitiesService: UserActivitiesService,
    private commentService: CommentService,
    private postStateService: PostStateService
  ) { }

  ngOnInit() {
    if (!this.post) {
      this.getPost(this.post);
    }
  }

  getPost(post): void {
    let request: Observable<any>;
    if(!post) {
      let p;
      const postId = this.route.snapshot.paramMap.get('id');
       request = this.postService.getPost(postId).pipe(
        concatMap((res: firebase.firestore.DocumentSnapshot) => {
          p = { ...res.data() } as Post;
          return forkJoin([
            this.commentService.getComments(p.postId),
            this.likeService.getLikes(p.postId, 1),
          ]);
        }),
        concatMap(results => {
          this.logger.info('###Results', results);
          p.comments = results[0].docs.map(cur => cur.data());
          p.likes = results[1].docs.map(cur => cur.data());
          return of(p);
        })
      )
    } else {
      request = of(post);
    }
    
    this.postSubscription = request.pipe(concatMap(res => {
      const p = res;
      // book mark, like, view goes to this by forkjoin
     return this.getLikesByPostIdAndUid(p);
    })).subscribe((result: any) => {
      this.logger.info('### final ', result);
      this.updatedPost = result;
      this.postStateService.setPosts([this.updatedPost]);
      if (this.updatedPost.photoURL) {
        this.hasImage = true;
      }
      this.hasPost = true;

      // this.userActivitiesService.addView(this.post);
      // this.likeService.removeLikes(this.post.postId, 1);
      // this.getActivities();
      // this.viewService.updateViews(this.post);
    });
  }
  //
  getLikesByPostIdAndUid(post) {
    return this.likeService.getLikesByUidAndPostId(post.postId).pipe(concatMap(res => {
      const likes = res.docs.map(like => like.data());
      const comments = new Map();

      /* MAPPING COMMENTS */
      post.comments.forEach(comment => {
        comments.set(comment.commentId, comment);
      });
      likes.forEach(like => {
        if (like.type === 1) {
          post.isLiked = like;
        }
        else {
          comments.get(like.commentId).isLiked = like;
        }
      });
      post.comments = Array.from(comments).map(cur => cur[1]);
      this.logger.info('### updated POST BY ADDING LIKE STATUS ', post);
      return of(post);
    }));
  }
  //


  getActivities() {
    const user = this.user;
    this.userActivitiesService.getActivities(user).subscribe(res => {
      this.logger.info('### get activities', res.docs[0].data());
    });
  }
  updatePost(post) {
    this.postService.updatePost(post.postId, post);
  }

  ngOnDestroy() {
    this.logger.info('### post detail destroyed ####');
    this.postSubscription.unsubscribe();
  }
}
