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
import { CommentService } from '../../core/services/comment/comment.service';
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
          this.postService.getPostsByUid(),
          this.commentService.getCommentsByUid(),
          this.likeService.getLikesByUid(),
        ];
        return forkJoin(requests);
      })
    ).subscribe((results) => {

      this.posts = results[0].docs.map(post => post.data() as Post);
      this.comments = results[1].docs.map(comment => comment.data() as Comment);
      this.likes = results[2].docs.map(like => like.data() as Like);
      this.logger.info('### Post ',results[0].docs);
      this.logger.info('### Comment ',results[1].docs);
      this.logger.info('### Likes ',results[2].docs);
      // this.likedPostsByComment = results;
    }, (err) => {
      this.logger.info(err);
    });
  }
}
