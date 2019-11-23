import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../shared/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Observable } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: Post;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private logger: LoggerService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getPost();
  }
  getPost(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id)
      .subscribe((data: any) => {
        this.post = data.payload.data() as Post;
        this.logger.info('### get post by postId', this.post);
      });
  }
  commentEmit(e) {
    this.logger.info('post is updated ', e);
    const comment = e;
    this.logger.info('### update Post', this.post);
    this.logger.info(this.post.hasOwnProperty('comments'));
    if (this.post.hasOwnProperty('comments')) {
      this.post.comments.push(comment);
    }
    else {
      this.post.comments = [comment];
    }
    this.updatePost(this.post);
  }
  updatePost(post) {
    this.postService.updatePost(post.postId, post).subscribe(res => {
      this.logger.info('post is successfully updated', res);
    });
  }

  addLike() {
    // get current user.
    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const user: User = { displayName, uid, photoURL, email, emailVerified };
    
    if (this.post.hasOwnProperty('likes')) {
      this.post.likes.push(user);
    }
    else {
      this.post.likes = [user];
    }
    // update post by adding current user to likes
    this.updatePost(this.post);

    // update user to keep track of which posts user has liked.
  }
}
