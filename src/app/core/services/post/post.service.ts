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
import * as firebase from 'firebase/app';@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private af: AngularFirestore,
    private logger: LoggerService,
    private helperService: HelperService,
  ) { }

  /* Get post list */
  getPosts(postLimit) {
    return this.af.collection<Post>('posts', ref => ref.orderBy('createdAt', 'desc').limit(postLimit)).get();
  }
  getPostsPaignated (lastPost, postLimit) {
    return this.af.collection<Post>('posts', ref => ref.orderBy('createdAt', 'desc').startAfter(lastPost.createdAt).limit(postLimit)).get();
  }

  getPostsByUid(uid) {
    return this.af
      .collection<Post>('posts', ref => ref.where('author.uid', '==', `${uid}`)).get();
  }

  /* Get post */
  getPost(postId: string) {
    return this.af.collection<Post>('posts').doc(postId).get();
  }

  getBookmarkedPost(postIds, limitedPost) {
    return this.af.collection('posts', ref => ref.where('postId', 'in', postIds).limit(limitedPost)).get();
  }

  /* Create post */
  addPost(post: Post) {
    const id = this.af.createId();
    post.postId = id;
    const query = this.af
      .collection<Post>('posts').doc(post.postId).set(post);
    return of(query);
  }

  /* Update post */
  updatePost(id, post: Post) {
    const query = this.af
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
        this.af
          .collection<Post>('posts')
          .doc<Post>(postId)
          .valueChanges()
      );
    });
    return requests;
  }

  /* Delete post */
  deletePost(id: string) {
    const postRef = this.af
      .collection<Post>('posts', ref => ref.where('postId', '==', id));
    const commentRef = this.af.collectionGroup<Comment>('comments', ref => ref.where('postId', '==', id).orderBy('createdAt'));
    const likeRef = this.af.collectionGroup('likes', ref => ref.where('postId', '==', id).orderBy('type'));

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
    const query = this.af
      .collectionGroup<Comment>('comments'
        , ref => ref.where('author.uid', '==', uid).orderBy('createdAt', 'asc')).get().pipe(concatMap(res => {
          const postIds = res.docs.map(cur => cur.data().postId);
          this.logger.info('### post IDS !!!!', postIds);
          return postIds.length > 0  ? 
          this.af.collection<Post>('posts', ref => ref.where('postId', 'in', postIds.slice(0,6)).limit(limitedPost)).get() : of(null);
          // return of(res);
        }));
    return query;
  }
}
