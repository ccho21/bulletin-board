import { Component, OnInit } from '@angular/core';
import { Observable, of, forkJoin, combineLatest } from 'rxjs';
import { User } from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { switchMap, mergeMap, map, concatMap } from 'rxjs/operators';
import { UserService } from '@app/core/services/user/user.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { PostService } from '../../core/services/post/post.service';
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
    this.getUser().subscribe((res: User) => {
      const { uid, displayName, photoURL, emailVerified, email } = res;
      this.user = { uid, displayName, photoURL, emailVerified, email } as User;
      
      this.getPosts(uid).subscribe(((res: any) => {
        this.logger.info('### res', res);
      }));

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
    return this.postService.getPostsByUid(uid);
  }

}
