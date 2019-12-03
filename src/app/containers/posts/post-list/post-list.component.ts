import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../shared/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Post } from '../../../shared/models/post';
import { LikeService } from '@app/core/services/like/like.service';
import { mergeMap, toArray, take, tap, map } from 'rxjs/operators';
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
  constructor(
    private logger: LoggerService,
    private postService: PostService,
    private likeService: LikeService,
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    const posts: Post[] = [];
    let p: Post;
    let length: number;
    const postSubs = this.postService.getPosts().pipe(mergeMap((posts) => {
      length = posts.length;
      this.logger.info('length ', length);
      this.logger.info('posts ', posts);
      const a = [1,2,3,4];
      return posts;
    }),
    mergeMap(res => {
      this.logger.info('### res', res);
      return res;
    }),
    // take(2),
    toArray(),
    )

    postSubs.subscribe(val => console.log(val));

    const source = from([1,2,3,4,5]);
  const example = source.pipe(
      mergeMap(res => of(res)),
    toArray()
    );
    
const subscribe = example.subscribe(val => console.log('### val', val));
  }

  ngOnDestroy() {
    this.logger.info('### post list detail is destroyed');
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