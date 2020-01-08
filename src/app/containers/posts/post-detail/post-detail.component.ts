import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../core/services/post/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Observable, from, Subscription, pipe, forkJoin, of } from 'rxjs';
import { User } from '@app/shared/models/user';
import { LikeService } from '@app/core/services/like/like.service';
import { Like } from '@app/shared/models/like';
import { ViewService } from '@app/core/services/view/view.service';
import { UserActivitiesService } from '@app/core/services/user-activities/user-activities.service';
import { concatMap } from 'rxjs/operators';
import { CommentService } from '@app/core/services/comment/comment.service';
import { PostStateService } from '../post-state.service';
import { ModalService } from '@app/core/services/modal/modal.service';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: Post;
  postLikes: Like;
  updatedPost;
  user: User;
  isPostLiked: boolean;
  postSubscription: Subscription;
  hasPost: boolean;
  hasImage: boolean;
  postId: string;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private logger: LoggerService,
    private likeService: LikeService,
    private viewService: ViewService,
    private userActivitiesService: UserActivitiesService,
    private commentService: CommentService,
    private postStateService: PostStateService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    // if (!this.post) {
    //   this.getPost(this.post);
    // }
    if (this.postId) {
      this.getPost(this.postId);
    }
  }

  getPost(postId): void {
    let request: Observable<any>;
    if (postId) {
      let p;
      request = this.postService.getPost(postId).pipe(
        concatMap((res: firebase.firestore.DocumentSnapshot) => {
          p = { ...res.data() } as Post;
          return forkJoin([
            this.commentService.getComments(p.postId),
            this.likeService.getLikes(p.postId, 1)
          ]);
        }),
        concatMap(results => {
          p.comments = results[0].docs.map(cur => cur.data());
          p.likes = results[1].docs.map(cur => cur.data());
          return of(p);
        })
      );
    }
    this.postSubscription = request
      .pipe(
        concatMap(res => {
          const p = res;
          // book mark, like, view goes to this by forkjoin
          return this.getLikesByPostIdAndUid(p);
        })
      )
      .subscribe((result: any) => {
        this.logger.info('### final ', result);
        this.updatedPost = result;
        this.postStateService.setPosts([this.updatedPost]);
        if (this.updatedPost.photoURLs.length) {
          this.hasImage = true;
        }
        this.hasPost = true;
      });
  }
  //
  getLikesByPostIdAndUid(post) {
    return this.likeService.getLikesByUidAndPostId(post.postId).pipe(
      concatMap(res => {
        const likes = res.docs.map(like => like.data());
        const comments = new Map();

        /* MAPPING COMMENTS */
        post.comments.forEach(comment => {
          comments.set(comment.commentId, comment);
        });
        likes.forEach(like => {
          if (like.type === 1) {
            post.isLiked = like;
          } else {
            comments.get(like.commentId).isLiked = like;
          }
        });
        post.comments = Array.from(comments).map(cur => cur[1]);
        this.logger.info('### updated POST BY ADDING LIKE STATUS ', post);
        return of(post);
      })
    );
  }
  //

  displayUsers(post, content) {
    this.logger.info('### display Users', this.postLikes);
    this.modalService.openVerticallyCentered(content).subscribe(res => {
      this.logger.info('### modal result ', res);
    });
  }

  getActivities() {
    const user = this.user;
    this.userActivitiesService.getActivities(user).subscribe(res => {
      this.logger.info('### get activities', res.docs[0].data());
    });
  }
  updatePost(post) {
    // this.postService.updatePost(post.postId, post);
    this.logger.info('### update post should be implemented');
  }

  deletePost(post) {
    this.logger.info('### delete post should be implemented');
  }

  getPostLikes(p) {
    const postLikes = p.likes.filter(like => like.type === 1);
    this.postLikes = postLikes;
    return postLikes.slice(1).length;
  }

  getFirstLikeDisplayName(post): string {
    // this.logger.info('### get first like display name', post);
    const p = post.likes.filter(p => p.type === 1);
    if (p.length) {
      return p[0].user.displayName;
    } else {
      return '';
    }
  }
  getFirstListPhotoURL(post): string {
    const p = post.likes.filter((p) => p.type === 1);
    if (p.length) {
      return p[0].user.photoURL;
    } else {
      return '';
    }
  }

  ngOnDestroy() {
    this.logger.info('### post detail destroyed ####');
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
  /* UI STUFF */
  openActionModal(component) {
    this.modalService.openSmallCentered(component);
  }
}
