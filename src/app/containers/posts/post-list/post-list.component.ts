import { Component, OnInit, OnDestroy, HostBinding, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
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
  filteredPosts = [];
  default = 'https://firebasestorage.googleapis.com/v0/b/bulletin-board-d1815.appspot.com/o/uploads%2F1582757472106_placeholder.jpg?alt=media&token=cb624601-3ea1-45e8-a065-89c2a464e7ab';
  @Input() postObservable: Observable<any>;
  @Input() isWriteable?: boolean;
  @Input() postLimit: number;
  @Input() bookmarkValid: boolean;
  @Input() commentedValid: boolean;
  @Input() noMessage?: string;
  @Output() messageEmit: EventEmitter<any> = new EventEmitter<any>(); // Emit form value

  // infinit scrolling & spinner
  numberOfPosts = 0;
  showSpinner = false;
  postsEnd = false;
  previousPosts: {}[] = [];
  message: string;
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
    this.logger.info('#### POST LIST NG ONINIT POST OBSERVABLES', this.postObservable, this.noMessage);
    this.numberOfPosts = this.postLimit ? this.postLimit : 0;

    this.postStateService.postSearchEmitted().subscribe(keyword => {
      this.logger.info('## search working??', keyword);
      this.filterPosts(keyword);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.postObservable && this.postObservable) {
      this.logger.info('### NG ON CHANGE ###', changes, this.postObservable);
      this.getPosts(this.postObservable);
    }
  }

  onScroll() {
    this.numberOfPosts += this.postLimit;
    this.logger.info('### number of posts with Post limit ###', this.postLimit, this.numberOfPosts);
    const observable = this.postService.getPosts(this.numberOfPosts);
    if (this.bookmarkValid) {

    } else if (this.commentedValid) {

    } else {
      this.getPosts(observable);
    }
  }

  getPosts(postObservable) {
    if (postObservable) {
      this.showSpinner = true;
      this.postSubscription = postObservable.pipe(
        concatMap((results: any) => {
          this.logger.info('### post 1', results);
          return results ? from(results.docs) : of(null);
        }),
        concatMap((res: any) => {
          this.logger.info('### post 2', res);
          if (res) {
            const post = res.data();
            return forkJoin([
              of(post),
              this.likeService.getLikes(post.postId, 1),
              this.commentService.getComments(post.postId)
            ]);
          } else {
            return of(null);
          }
        }),
        concatMap((results: any) => {
          this.logger.info('### post 3', results);
          if (results) {
            const post = results[0];
            post.likes = results[1].docs.map(cur => cur.data());
            post.comments = results[2].docs.map((cur: any) => cur.data());
            return of(post);
          } else { return of(null); }
        }),
        toArray(),
      ).subscribe(results => {
        if (results && results[0]) {
          this.posts = results as Post[];
          this.noMorePosts(results);

          this.logger.info('### FIANL IN POST LIST ###', this.posts);
          this.filteredPosts = this.posts.map(cur => ({ ...cur }));
          this.postStateService.setPosts(this.filteredPosts);
        } else {
          this.message = this.noMessage;
          this.logger.info('### MESSAGE ########', this.message);
          this.messageEmit.emit(this.message);
        }
        this.showSpinner = false;
      });
    }
  }

  filterPosts(keyword) {
    if (keyword) {
      this.filteredPosts = this.posts.filter(post => post.content.toLowerCase().includes(keyword.toLowerCase()));
    } else {
      this.filteredPosts = this.posts.map(cur => ({ ...cur }));
    }
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
    return `url(${post.photoURLs[0] ? post.photoURLs[0] : this.default})`;
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
