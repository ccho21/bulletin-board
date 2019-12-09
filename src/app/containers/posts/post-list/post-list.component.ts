import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../shared/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Post } from '../../../shared/models/post';
import { LikeService } from '@app/core/services/like/like.service';
import { mergeMap, map, scan } from 'rxjs/operators';
import { of, Subscription, from, forkJoin } from 'rxjs';
import { CommentService } from '../post-detail/comments/comment.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  likeSubscription: Subscription
  posts: Array<Post> = [];
  isPostLiked;
  postSubscription: Subscription;
  filteredPostList;
  constructor(
    private logger: LoggerService,
    private postService: PostService,
    private likeService: LikeService,
    private commentService: CommentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.getPosts();
  }
  getPosts() {
    this.postService.getPosts().subscribe(results => {
      this.logger.info('### FINAL ### ', results);
      this.posts = results.map(cur => cur.payload.doc.data() as Post);
    });
  }

  /* getPosts() {
    const posts: Post[] = [];
    let post;
    let length: number;
    this.postService.getPosts().pipe(mergeMap(results => {
      return results;
    }),
      map(res => {
        post = res.payload.doc.data() as Post;
        this.logger.info('#### post', post);
        return this.likeService.getNumOfLikes(post.postId);
      }),
      map(res => {
        post.likes = res;
        return this.commentService.getNumOfComments(post.postId);
      }),
      mergeMap(res => {
        post.comments = res;
        return of(post);
      }),
      scan((acc, val) => {
        acc.push(val);
        return acc;
      }, []))
      .subscribe(results => {
        this.logger.info('### FINAL ### ', results);
        this.posts = results.map(post => post as Post);
      });
  } */

  deletePost(post) {
    const postId = post.postId;
    this.postService.deletePost(postId).subscribe(res => {
      this.logger.info('deleting post', post);
      this.logger.info('call delete');
      this.initData();
    });
  }
  editPost(post) {
    this.logger.info(post);
    this.router.navigateByUrl(`/posts/${post.postId}/edit`);
  }

  ngOnDestroy() {
    this.logger.info('### post list is destroyed#######');
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}

// tap(res => this.logger.info('### tap', res)),
// mergeMap((post: Post) => {
//   this.logger.info('### each post', post);
//   const postId = post.postId;
//   p = post;
//   return this.likeService.getNumLikes(postId);
// }),
// mergeMap(res => {
//   this.logger.info('#2', res);
//   return of(p);
// }),
// take(length),