import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../shared/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Post } from '../../../shared/models/post';
import { LikeService } from '@app/core/services/like/like.service';
import { concatMap, toArray } from 'rxjs/operators';
import { of, Subscription, from, forkJoin  } from 'rxjs';
import { CommentService } from '../../../core/services/comment/comment.service';
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
    this.postService.getPosts().pipe(
      concatMap(results => {
        return from(results.docs);
      }),
      concatMap(res => {
        this.logger.info('individual', res);
        const post = res.data();
        return forkJoin([
          of(post),
          this.likeService.getLikes(post.postId, 1),
          this.commentService.getNumOfComments(post.postId)
        ]);
      }),
      concatMap(results => {
        const post = results[0];
        // post.likes = results[1].docs.map(cur => cur.data());
        // post.comments = results[2].docs.map(cur => cur.data());
        return of(post);
      }),
      toArray(),
    ).subscribe(results => {
      this.logger.info('### final Post LIST ###', results);
      this.posts = results as Post[];
    });
  }

  deletePost(post) {
    const postId = post.postId;
    this.postService.deletePost(postId);
    /* .subscribe(res => {
      this.initData();
    }); */
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