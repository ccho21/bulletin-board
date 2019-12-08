import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UserService } from '@app/core/services/user/user.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { PostService } from '../posts/shared/post.service';
import { Post } from '@app/shared/models/post';
import { CommentService } from '../posts/post-detail/comments/comment.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User;
  posts: Post[] = [];
  userId: string;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private logger: LoggerService,
    private postService: PostService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params) => {
        return this.authService.getSignedUser();
      }),
      switchMap((res: User) => {
        this.user = res;
        const uid = this.user.uid;
        return this.getPostsByUser(uid);
      })
    ).subscribe((res: Post[]) => {
      this.posts = res.map(cur => ({...cur}));
    });

    this.commentService.comments().subscribe(res => {
      this.logger.info('comments', res);
    });
  }

  getPostsByUser(uid) {
    return this.postService.getPostsByUid(uid);
  }

}
