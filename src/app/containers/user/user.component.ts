import { Component, OnInit } from '@angular/core';
import { Observable, of, forkJoin, combineLatest } from 'rxjs';
import { User } from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { switchMap, mergeMap, map } from 'rxjs/operators';
import { UserService } from '@app/core/services/user/user.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { PostService } from '../posts/shared/post.service';
import { Post } from '@app/shared/models/post';
import { CommentService } from '../posts/post-detail/comments/comment.service';
import { LikeService } from '@app/core/services/like/like.service';
import { delay } from 'q';
import { Like } from '@app/shared/models/like';
import { Comment } from '@app/shared/models/comment';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User;
  posts: Post[] = [];
  likedPosts: Post[] = [];
  likedPostsByComment: Post[] = [];
  comments: Comment[] = [];
  likes: Like[] = [];
  private userId: string;
  private uid: string;
  
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private logger: LoggerService,
    private postService: PostService,
    private commentService: CommentService,
    private likeService: LikeService
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.route.paramMap.pipe(
      switchMap((params) => {
        return this.authService.getSignedUser();
      }),
      mergeMap((res: User) => {
        this.user = res;
        this.uid = this.user.uid;
        this.logger.info(this.user);
        const requests = [
          this.postService.getPostsByUid(this.uid),
          this.commentService.getCommentsByUid(this.uid),
          this.likeService.getLikesByUid(this.uid),
        ]
        this.logger.info(this.likeService.getLikesByUid(this.uid));
        if(requests.length) {
          return combineLatest(requests);
        }
      }),
      switchMap(results => {
        this.logger.info(results);
        this.posts = results[0] as Post[];
        this.comments = results[1] as Comment[];
        this.likes = results[2] as Like[];
        return combineLatest(this.postService.getPostsByLikeId(this.likes));
      }),
      switchMap(results => {
        this.likedPosts = results;
        return combineLatest(this.postService.getPostsByCommentId(this.comments));
      })
    ).subscribe((results) => {
        this.logger.info(results);
        this.likedPostsByComment = results;
    }, (err) => {
      this.logger.info(err);
    });
  }
}
