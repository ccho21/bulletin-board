import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from '../../../shared/models/post';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { of, Observable, forkJoin, from } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { Comment } from '@app/shared/models/comment';
import { Like } from '@app/shared/models/like';
import { CommentService } from '@app/core/services/comment/comment.service';
import { SubCommentService } from '@app/core/services/sub-comment/sub-comment.service';
import { HelperService } from '@app/core/services/helper/helper.service';
import { AuthService } from '@app/core/services/auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private helperService: HelperService,
    private commentService: CommentService,
    private subCommentService: SubCommentService,
    private authService: AuthService
  ) { }

  /* Get post list */
  getPosts(limitedPost) {
    return this.db.collection<Post>('posts', ref => ref.limit(limitedPost)).get();
  }

  getPostsByUid(uid) {
    return this.db
      .collection<Post>('posts', ref => ref.where('author.uid', '==', `${uid}`)).get();
  }

  /* Get post */
  getPost(postId: string) {
    return this.db.collection<Post>('posts').doc(postId).get();
  }

  getBookmarkedPost(postIds, limitedPost) {
    return this.db.collection('posts', ref => ref.where('postId', 'in', postIds).limit(limitedPost)).get();
  }

  /* Create post */
  addPost(post: Post) {
    const id = this.db.createId();
    post.postId = id;
    const query = this.db
      .collection<Post>('posts').doc(post.postId).set(post);
    return of(query);
  }

  /* Update post */
  updatePost(id, post: Post) {
    const query = this.db
      .collection<Post>('posts')
      .doc(id)
      .update(post);
    return of(query);
  }

  getPostsByLikeId(likes: Like[]) {
    const recentLikes = likes.slice(0, 5);
    const type = 1;
    const requests: Array<Observable<Post>> = [];
    const postIds = recentLikes.filter(cur => cur.type === type);
    postIds.forEach((post, i) => {
      const postId = post.postId;
      requests.push(
        this.db
          .collection<Post>('posts')
          .doc<Post>(postId)
          .valueChanges()
      );
    });
    return requests;
  }

  /* Delete post */
  deletePost(id: string) {
    const postRef = this.db
      .collection<Post>('posts', ref => ref.where('postId', '==', id));
    const commentRef = this.db.collectionGroup<Comment>('comments', ref => ref.where('postId', '==', id).orderBy('createdAt'));
    const likeRef = this.db.collectionGroup('likes', ref => ref.where('postId', '==', id).orderBy('type'));

    const query = forkJoin([
      of(this.helperService.deleteCollection(postRef)),
      of(this.helperService.deleteCollection(commentRef)),
      of(this.helperService.deleteCollection(likeRef))
    ]);
    return query;
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

  getPostsByCommentId(uid, limitedPost) {
    const query = this.db
      .collectionGroup<Comment>('comments'
        , ref => ref.where('author.uid', '==', uid).orderBy('createdAt', 'asc')).get().pipe(concatMap(res => {
          const postIds = res.docs.map(cur => cur.data().postId);
          this.logger.info('### post IDS !!!!', postIds);
          return postIds.length > 0  ? 
          this.db.collection<Post>('posts', ref => ref.where('postId', 'in', postIds).limit(limitedPost)).get() : of(null);
          // return of(res);
        }));
    return query;
  }
}
