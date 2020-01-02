import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../core/services/post/post.service';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { Observable, from, Subscription, pipe, forkJoin, of } from 'rxjs';
import { User } from '@app/shared/models/user';
import { LikeService } from '@app/core/services/like/like.service';
import { Like } from '@app/shared/models/like';
import { ViewService } from '@app/core/services/view/view.service';
import { UserActivitiesService } from '@app/core/services/user-activities/user-activities.service';
import { concatMap } from 'rxjs/operators';
import { CommentService } from '@app/core/services/comment/comment.service';
import { PostStateService } from '../post-state.service';
import { ModalService } from '@app/core/services/modal/modal.service';
@Component({
  selector                                        : 'app-post-detail',
  templateUrl                                     : './post-detail.component.html',
  styleUrls                                       : ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post                                            : Post;
  postLikes                                       : Like;
  updatedPost;
  user                                            : User;
  isPostLiked                                     : boolean;
  postSubscription                                : Subscription
  hasPost                                         : boolean;
  hasImage                                        : boolean;
  constructor(
    private route                                 : ActivatedRoute,
    private postService                           : PostService,
    private logger                                : LoggerService,
    private likeService                           : LikeService,
    private viewService                           : ViewService,
    private userActivitiesService                 : UserActivitiesService,
    private commentService                        : CommentService,
    private postStateService                      : PostStateService,
    private modalService                          : ModalService
  ) { }

  ngOnInit() {
    if (!this.post) {
      this.getPost(this.post);
    }
  }

  getPost(post): void {
    let request                                   : Observable<any>;
    if(!post) {
      let p;
      const postId                                = this.route.snapshot.paramMap.get('id');
       request                                    = this.postService.getPost(postId).pipe(
        concatMap((res: firebase.firestore.DocumentSnapshot) => {
          p                                       = { ...res.data() } as Post;
          return forkJoin([
            this.commentService.getComments(p.postId),
            this.likeService.getLikes(p.postId, 1),
          ]);
        }),
        concatMap(results => {
          this.logger.info('###Results', results);
          p.comments                              = results[0].docs.map(cur => cur.data());
          p.likes                                 = results[1].docs.map(cur => cur.data());
          return of(p);
        })
      )
    } else {
      request                                     = of(post);
    }
    
    this.postSubscription = request.pipe(concatMap(res => {
      const p                                     = res;
      // book mark, like, view goes to this by forkjoin
     return this.getLikesByPostIdAndUid(p);
    })).subscribe((result: any) => {
      this.logger.info('### final ', result);
      this.updatedPost                            = result;
      this.postStateService.setPosts([this.updatedPost]);
      if (this.updatedPost.photoURL) {
        this.hasImage                             = true;
      }
      this.hasPost                                = true;
    });
  }
  //
  getLikesByPostIdAndUid(post) {
    return this.likeService.getLikesByUidAndPostId(post.postId).pipe(concatMap(res => {
      const likes                                 = res.docs.map(like => like.data());
      const comments                              = new Map();

      /* MAPPING COMMENTS */
      post.comments.forEach(comment => {
        comments.set(comment.commentId, comment);
      });
      likes.forEach(like => {
        if (like.type === 1) {
          post.isLiked                            = like;
        }
        else {
          comments.get(like.commentId).isLiked    = like;
        }
      });
      post.comments                               = Array.from(comments).map(cur => cur[1]);
      this.logger.info('### updated POST BY ADDING LIKE STATUS ', post);
      return of(post);
    }));
  }
  //

  getPostLikes(p) {
    const postLikes                               = p.likes.filter(like => like.type === 1);
    this.postLikes                                = postLikes;
    return postLikes.length;
  }

  displayUsers(post, content) {
    this.logger.info('### display Users', this.postLikes);
    this.modalService.openVerticallyCentered(content).subscribe(res => {
      this.logger.info('### modal result ', res);
    });
  }

  getActivities() {
    const user                                    = this.user;
    this.userActivitiesService.getActivities(user).subscribe(res => {
      this.logger.info('### get activities', res.docs[0].data());
    });
  }
  updatePost(post) {
    this.postService.updatePost(post.postId, post);
  }

  ngOnDestroy() {
    this.logger.info('### post detail destroyed ####');
    this.postSubscription.unsubscribe();
  }
}
