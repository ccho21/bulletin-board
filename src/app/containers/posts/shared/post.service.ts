import { Injectable } from "@angular/core";
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { Post } from "../../../shared/models/post";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { of, Observable, forkJoin, from } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { Comment } from '@app/shared/models/comment';
import { Like } from '@app/shared/models/like';
import { CommentService } from '@app/containers/posts/post-detail/comments/comment.service';
import { SubCommentService } from '@app/containers/posts/post-detail/comments/sub-comment.service';
import { HelperService } from '@app/core/services/helper/helper.service';
@Injectable({
  providedIn: "root"
})
export class PostService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private helperService: HelperService,
    private commentService: CommentService,
    private subCommentService: SubCommentService
  ) { }

  /* Create post */
  addPost(post: Post) {
    const id = this.db.createId();
    post.postId = id;
    const query = this.db.collection<Post>('posts').doc(post.postId).set(post);
    return of(query);
  }

  /* Get post */
  getPost(id: string) {
    return this.db.collection<Post>('posts').doc(id).snapshotChanges();
  }

  /* Get post list */
  getPosts() {
    return this.db.collection<Post>('posts').get();
  }

  getPostsByUid(uid) {
    return this.db.collection<Post>('posts', ref => ref.where('author.uid', '==', `${uid}`)).valueChanges();
  }

  /* Update post */
  updatePost(id, post: Post) {
    const query = this.db
      .collection<Post>('posts')
      .doc(id)
      .update(post);
    return of(query);
  }

  /* Delete post */
  /*  deletePost(id: string) {
     const query = this.db
       .collection<Post>('posts')
       .doc(id)
       .delete();
     return of(query).pipe(take(1), concatMap(res => {
       return res;
     }));
   } */

  deletePost(postId: string) {
    this.logger.info('### yo');
    const ref = this.db
      .collection<Post>('posts').doc(postId);
    ref.collection<Comment>('comments').get().subscribe(res => {
      this.logger.info('### res docs', res.docs);

      const requests = res.docs.map(comment => {
        this.logger.info('### ', comment.data());
        const commentId = comment.data().commentId;
        const request = this.subCommentService.deleteSubCommentAll(commentId);
        return this.helperService.deleteCollection(request);
      });
      return forkJoin(requests);
    })
  }


  /* ACTIVITIES */
  updatePostViews(post: Post) {
    let count = 0;
    if (post.hasOwnProperty('views')) {
      count = post.views += 1;
    } else {
      count = post.views = 1;
    }
    post.views = count;
    this.updatePost(post.postId, post);
  }

  getPostsByLikeId(likes: Like[]) {
    const recentLikes = likes.slice(0, 5);
    const type = 1;
    const requests: Array<Observable<Post>> = [];
    const postIds = recentLikes.filter(cur => cur.type === type);
    postIds.forEach((post, i) => {
      const postId = post.postId;
      requests.push(this.db.collection<Post>('posts').doc<Post>(postId).valueChanges());
    });
    return requests;
  }

  getPostsByCommentId(comments: Comment[]) {
    const requests: Array<Observable<Post>> = [];
    const recentComments = comments.map((cur) => {
      return cur.postId;
    });
    const posts = Array.from(new Set(recentComments));
    const filterPosts = posts.slice(0, 5);
    filterPosts.forEach((postId, i) => {
      requests.push(this.db.collection<Post>('posts').doc<Post>(postId).valueChanges());
    });
    return requests;
  }
}
