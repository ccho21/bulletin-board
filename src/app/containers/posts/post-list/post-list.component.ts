import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../shared/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Post } from '../../../shared/models/post';
import { LikeService } from '@app/core/services/like/like.service';
import { mergeMap, concatAll, finalize } from 'rxjs/operators';
import { of, Subscription, from } from 'rxjs';
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
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.postSubscription = this.postService.getPosts().subscribe((results) => {
      this.logger.info('### snapshot changes', results);
      this.posts = results.map(post => ({...post.payload.doc.data()}));
      // this.posts = results.map(post => ({...post}));
      const data = this.posts.map(cur => ({...cur}));
      if (data.length) {
        this.posts = data.map((post: Post) => {
          return post;
        });
        this.filteredPostList = this.posts.map(cur => ({ ...cur }));
        this.logger.info('filtered postlist ', this.filteredPostList);
      }
    });
  }

  deletePost(post) {
    const postId = post.postId;
    this.postService.deletePost(postId).subscribe(res => {
      this.logger.info('deleting post', post);
      this.logger.info('call delete');
      this.initData();
    });
  }
  editPost(post) {
    this.postService.deletePost(post.postId);
  }
  
  ngOnDestroy() {
    this.logger.info('### post list is destroyed#######');
    if(this.postSubscription) {
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