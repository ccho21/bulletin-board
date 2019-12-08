import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Post } from "../../../shared/models/post";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { AuthService } from '@app/core/services/auth/auth.service';
import { from, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Comment } from '@app/shared/models/comment';
import { Like } from '@app/shared/models/like';
@Injectable({
  providedIn: "root"
})
export class PostService {
  constructor(private db: AngularFirestore, private logger: LoggerService) {}

  /* Create post */
  addPost(post: Post) {
    const id = this.db.createId();
    post.postId = id;
    const query = this.db.collection('posts').doc(post.postId).set(post);
    return of(query);
  }

  /* Get post */
  getPost(id: string) {
    return this.db.collection('posts').doc(id).snapshotChanges();
  }

  /* Get post list */
  getPosts() {
    return this.db.collection('posts').stateChanges(['added']);
  }

  getPostsByUid(uid) {
    return this.db.collection<Post>('posts', ref=> ref.where('author.uid', '==', `${uid}`)).valueChanges();
  }

  /* Update post */
  updatePost(id, post: Post) {
    const query = this.db
      .collection('posts')
      .doc(id)
      .update(post);
      return of(query);
  }

  updatePostViews(post: Post) {
    let count = 0;
    if(post.hasOwnProperty('views')) {
      count = post.views += 1;
    } else {
      count = post.views = 1;
    }
    post.views = count;
    this.updatePost(post.postId, post);
  }

  /* Delete post */
  deletePost(id: string) {
    const query = this.db
      .collection('posts')
      .doc(id)
      .delete();
    return of(query).pipe(take(1), mergeMap(res => {
      return res;
    }), );
  }
}
