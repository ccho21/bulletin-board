import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Post } from "../post";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { mergeMap } from 'rxjs/operators';
@Injectable({
  providedIn: "root"
})
export class PostService {
  constructor(private db: AngularFirestore, private logger: LoggerService) {}

  /* Create post */
  addPost(post: Post) {
    return from(this.db.collection('posts').add(post)).pipe(
      mergeMap(res => {
        post.postId = res.id;
        return res.set(post);
      })
    );

  }

  /* Get post */
  getPost(id: string) {
    return from(this.db.collection('posts').doc(id).snapshotChanges());
  }

  /* Get post list */
  getPosts() {
    return from(this.db.collection('posts').snapshotChanges());
  }

  /* Update post */
  updatePost(id, post: Post) {
    return from(this.db
      .collection('posts')
      .doc(id)
      .set(post));
  }

  /* Delete post */
  deletePost(id: string) {
    return this.db
      .collection('posts')
      .doc(id)
      .delete();
  }

  // Error management
  private errorMgmt(error) {
    this.logger.info(error);
  }
}
