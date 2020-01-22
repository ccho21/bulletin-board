import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../core/services/post/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Observable, from, Subscription, pipe, forkJoin, of, Subject } from 'rxjs';
import { User } from '@app/shared/models/user';
import { LikeService } from '@app/core/services/like/like.service';
import { Like } from '@app/shared/models/like';
import { ViewService } from '@app/core/services/view/view.service';
import { UserActivitiesService } from '@app/core/services/user-activities/user-activities.service';
import { concatMap } from 'rxjs/operators';
import { CommentService } from '@app/core/services/comment/comment.service';
import { PostStateService } from '../post-state.service';
import { ModalService } from '@app/core/services/modal/modal.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@app/core/services/auth/auth.service';
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
  postIndex: number;

  postListLength: number;
  leftArrowValid = true;
  rightArrowValid = true;
  isAuthor: boolean;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private logger: LoggerService,
    private likeService: LikeService,
    private userActivitiesService: UserActivitiesService,
    private commentService: CommentService,
    private postStateService: PostStateService,
    private modalService: ModalService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.logger.info('###catching postID', this.postId);
    this.getPost(this.postId);
  }

  isUserAuthor(post): boolean {
    const { uid } = this.authService.getCurrentUser();
    const authorUid = post.author.uid;
    return uid === authorUid ? true : false;
  }

  getPost(postId): void {
    let request: Observable<any>;
    const post = this.findPost(postId);
    if (!post) {
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
    } else {
      request = of(post);
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
        this.logger.info('### GET POST DETAIL FINAL', result);
        this.updatedPost = result;
        this.postIndex = this.postStateService.setPost(this.updatedPost);
        this.logger.info('### post INDEX', this.postIndex);

        // check if the current user matches with author of the post.
        this.isAuthor = this.isUserAuthor(this.updatedPost);

        this.checkValidArrow(this.postIndex);
        if (this.updatedPost.photoURLs.length) {
          this.hasImage = true;
        }
        this.hasPost = true;
      });
  }

  checkValidArrow(postIndex) {
    this.logger.info('### postIndex ',postIndex);
    this.logger.info('### length ', this.postListLength);
    this.logger.info(this.leftArrowValid, this.rightArrowValid);
    if (postIndex === this.postListLength - 1) {
      this.rightArrowValid = false;
    } else if (postIndex === 0) {
      this.leftArrowValid = false;
    }
  }
  //
  findPost(postId) {
    const posts = this.postStateService.getPosts();
    this.logger.info('########### POSTS!!! in post detail ', posts);
    const postIndex = posts.findIndex(post => post.postId === postId);
    this.postListLength = posts.length;
    this.postIndex = postIndex;
    return posts[postIndex];
  }

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
    if (this.isAuthor) {
      this.logger.info('### delete post should be implemented');
      this.postService.deletePost(post.postId).subscribe(result => {
        this.logger.info('### all deleted', result);
      });
    }
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

  clickNext() {
    const listLength = this.postStateService.getPostListLength();
    if (this.postIndex !== listLength - 1) {
      const postId = this.postStateService.getPostIdByIndex(this.postIndex + 1);
      this.postStateService.postIdEmit(postId);
    }
  }

  clickBack() {
    if (this.postIndex !== 0) {
      const postId = this.postStateService.getPostIdByIndex(this.postIndex - 1);
      this.postStateService.setPostIndex(this.postIndex - 1);
      this.postStateService.postIdEmit(postId);
    }
  }

  /* UI STUFF */
  openActionModal(component) {
    this.modalService.openSmallCentered(component);
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}
