import { Component, OnInit } from '@angular/core';
import { Observable, of, forkJoin, combineLatest } from 'rxjs';
import { User } from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { switchMap, mergeMap, map, concatMap } from 'rxjs/operators';
import { UserService } from '@app/core/services/user/user.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { PostService } from '../core/services/post/post.service';
import { Post } from '@app/shared/models/post';
import { CommentService } from '../core/services/comment/comment.service';
import { LikeService } from '@app/core/services/like/like.service';
import { delay } from 'q';
import { Like } from '@app/shared/models/like';
import { Comment } from '@app/shared/models/comment';
import { BookmarkService } from '@app/core/services/bookmark/bookmark.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User;
  posts = [];
  bookmarkedPosts = [];
  likedPostsByComment = [];
  comments = [];
  likes = [];
  private userId: string;
  private uid: string;

  numOfPosts: number;
  numOfComments: number;
  numOfLikes: number;
  fullName: string;
  postObservable: any;
  bookmarkedObservable: any;
  commentedObservable: any;
  postLimit: number;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private logger: LoggerService,
    private postService: PostService,
    private commentService: CommentService,
    private likeService: LikeService,
    private bookmarkService: BookmarkService
  ) { }

  ngOnInit() {

    this.getUser().pipe(concatMap((res: User) => {
      const { uid, displayName, photoURL, emailVerified, email } = res;
      this.user = { uid, displayName, photoURL, emailVerified, email } as User;
      const nArr = displayName.split('_').map(cur => cur.charAt(0).toUpperCase() + cur.substring(1));
      this.logger.info(nArr);
      this.fullName = `${nArr[0] || ''} ${nArr[1] || ''} ${nArr[2] || ''}`;
      this.logger.info(this.fullName);
      return forkJoin([
        this.getPosts(uid),
        this.getComments(uid),
        this.getLikes(uid),
        this.bookmarkService.getBookmarkedPostId(uid)
      ]);
    })).subscribe((results) => {
      const uid = this.user.uid;
      this.logger.info('### results from forkjoin in user component', results);

      const postIds = results[3];
      this.postLimit = 6;
      if (postIds.length) {
        this.bookmarkedObservable = this.postService.getBookmarkedPost(postIds);
      }
      
      if (uid) {
        this.commentedObservable =  this.postService.getPostsByCommentId(uid);
      }

      this.logger.info(' this.bookmarkedObservable',  this.bookmarkedObservable);
      this.logger.info(' this.commentedObservable',  this.commentedObservable);
    });
  }

  getUser() {
    return this.route.paramMap.pipe(
      concatMap((params) => {
        return this.authService.getSignedUser();
      })
    );
  }

  getPosts(uid) {
    return this.postService.getPostsByUid(uid).pipe(concatMap(res => {
      this.posts = res.docs.map(cur => cur.data());
      this.numOfPosts = this.likes.length;
      return of(this.posts);
    }));
  }

  getComments(uid) {
    return this.commentService.getCommentsByUid(uid).pipe(concatMap(res => {
      this.comments = res.docs.map(cur => cur.data());
      this.numOfComments = this.likes.length;
      return of(this.comments);
    }));
  }

  getLikes(uid) {
    return this.likeService.getLikesByUid(uid).pipe(concatMap(res => {
      this.likes = res.docs.map(cur => cur.data());
      this.numOfLikes = this.likes.length;
      return of(this.likes);
    }));
  }
}
