import { Component, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../shared/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Observable, from } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { User } from '@app/shared/models/user';
import { UserService } from '@app/core/services/user/user.service';
import { LikeService } from '@app/core/services/like/like.service';
import { Like } from '@app/shared/models/like';
import { type } from 'os';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: Post;
  user: User;
  isPostLiked: boolean;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private logger: LoggerService,
    private authService: AuthService,
    private userService: UserService,
    private likeService: LikeService
  ) { }

  ngOnInit() {
    if (!this.post) {
      this.getPost();
    }

    //is liked?
  }
  getPost(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id)
      .subscribe((data: any) => {
        this.post = data.payload.data() as Post;
        this.isLiked();
      });
  }
  isLiked() {
    this.likeService.isLiked(this.post.postId, 1);
    // .subscribe(res => {
    //   this.logger.info('### is liked result ', res);
    //   this.isPostLiked = res.length ? true : false;
    //   this.logger.info('### isPostLiked', this.isPostLiked);
    // });
  }

  getCurrentUser() {
    // Author
    const { displayName, uid, photoURL, email, emailVerified } = this.authService.getCurrentUser();
    const user: User = { displayName, uid, photoURL, email, emailVerified };
    return user;
  }
  commentEmit(e) {
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
      this.logger.info('### post is successfully updated', res);
    });
  }
  addLike() {
    // go to remove like if it is already there
    if (this.isPostLiked) {
      this.deleteLike();
      return;
    }
    const post = this.cleanUp(this.post);
    const user = this.getCurrentUser();
    const likeDTO: Like = {
      type: 1,
      post,
      user
    }
    this.likeService.addLike(likeDTO);
  }
  deleteLike() {
    this.logger.info('### delete like start');
    const id = this.post.postId;
    const type = 1;
    this.likeService.deleteLike(id, type);
  }
  cleanUp(data) {
    const copiedData = Object.assign({}, data);
    if (copiedData.hasOwnProperty('comments')) {
      delete copiedData.comments;
      delete copiedData.author;
    }
    return copiedData;
  }
  /* checkLike(user): Post {
    //check if the post was liked by the current user.
    const post = { ...this.post };
    if (!post.hasOwnProperty('likes') || post.likes.length === 0) {
      this.logger.info('### no like is here');
      post.likes = [user.uid];
    }
    else {
      post.likes.forEach((cur, i) => {
        if (cur === user.uid) {
          this.logger.info('### like deleted');
          post.likes.splice(i, 1);
        } else {
          this.logger.info('### like added');
          post.likes.push(user.uid);
        }
      });
    }
    this.logger.info('### post before udpate', post);
    // update post by adding current user to likes
    return post;
  }
  checkLikePosts(post: Post): User {
    const user = this.user;
    // update user to keep track of which posts user has liked.
    this.logger.info('### user', user);
    this.logger.info('### post', post);
    if (!user.hasOwnProperty('likePosts') || user.likePosts.length === 0) {
      this.logger.info('### no like post');
      user.likePosts = [post.postId];
    } else {
      this.user.likePosts.forEach((cur, i) => {
        if(cur === post.postId) {
          this.logger.info('like detected');
          user.likePosts.splice(i, 1);
        }
        else {
          this.logger.info('### like needs to added');
          user.likePosts.push(post.postId);
        }
      });
    }
    return {...user};
  }
  addLike() {
    this.logger.info('??');
  
    // // update user
    const user = this.checkLikePosts(this.post);
    this.logger.info('### user before udpate', user);
    this.updateUser(user);
    this.user = user;

    this.post = this.checkLike(this.user);
    this.updatePost(this.post);
  }
  updateUser(user) {
    from(this.userService.setUserData(user)).subscribe(res => {
      this.logger.info('### User update success', res);
    });
  } */
}
