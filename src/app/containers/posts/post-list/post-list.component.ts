import { Component, OnInit, OnDestroy, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PostService } from '../../../core/services/post/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Post } from '../../../shared/models/post';
import { LikeService } from '@app/core/services/like/like.service';
import { concatMap, toArray } from 'rxjs/operators';
import { of, Subscription, from, forkJoin, Observable } from 'rxjs';
import { CommentService } from '../../../core/services/comment/comment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PostStateService } from '../post-state.service';
import { ModalService } from '@app/core/services/modal/modal.service';
import { BookmarkService } from '@app/core/services/bookmark/bookmark.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy, OnChanges {
  posts: Array<Post> = [];
  isPostLiked;
  postSubscription: Subscription;
  filteredPostList;

  @Input() postObservable: any;
  @Input() isWriteable?: boolean;

  // infinit scrolling & spinner
  showSpinner = false;
  numberOfPosts = 6;
  postsEnd = false;
  previousPosts: {}[] = [];
  constructor(
    private logger: LoggerService,
    private postService: PostService,
    private likeService: LikeService,
    private commentService: CommentService,
    private router: Router,
    private route: ActivatedRoute,
    private postStateService: PostStateService,
  ) { }

  ngOnInit() {
    this.logger.info('#### POST LIST NG ONINIT POST OBSERVABLES');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.logger.info('this.postObservable', changes);
      this.getPosts(this.postObservable);
    }
  }

  onScroll() {
    this.numberOfPosts += 6;
    this.postObservable = this.postService.getPosts(this.numberOfPosts);
    this.getPosts(this.postObservable);
  }

  getPosts(postObservable) {
    this.showSpinner = true;
    this.postSubscription = postObservable.pipe(
      concatMap((results: any) => {
        return from(results.docs);
      }),
      concatMap((res: any) => {
        const post = res.data();
        return forkJoin([
          of(post),
          this.likeService.getLikes(post.postId, 1),
          this.commentService.getComments(post.postId)
        ]);
      }),
      concatMap((results: any) => {
        const post = results[0];
        post.likes = results[1].docs.map(cur => cur.data());
        post.comments = results[2].docs.map((cur: any) => cur.data());
        return of(post);
      }),
      toArray(),
    ).subscribe(results => {
      this.logger.info('### FIANL IN POST LIST ###', results);
      this.posts = results as Post[];
      this.postStateService.setPosts(this.posts);
      this.logger.info('### get POSTS', this.postStateService.getPosts());
      this.showSpinner = false;
      this.noMorePosts(results);
    });
  }

  noMorePosts(data): void {
    if (this.previousPosts.length === data.length) {
      this.postsEnd = true;
    } else {
      this.previousPosts = data;
      this.postsEnd = false;
    }
  }

  deletePost(post) {
    const postId = post.postId;
    this.postService.deletePost(postId);
  }

  editPost(post) {
    this.logger.info(post);
    this.router.navigateByUrl(`p/${post.postId}/edit`);
  }

  getBackgroundImageUrl(post) {
    return `url(${post.photoURLs[0]})`;
  }

  clickPost(post, index) {
    this.postStateService.setPostIndex(index);
    const base = `${this.router.url}/p/${post.postId}`;
    this.logger.info(this.router);
    this.router.navigateByUrl(base);
  }

  ngOnDestroy() {
    this.logger.info('### post list is destroyed#######');
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}
