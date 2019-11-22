import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Post } from "../post";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class PostsService {
  constructor(private db: AngularFirestore, private logger: LoggerService) {}

  /* Create post */
  addPost(post: Post) {
    return from(this.db.collection('posts').add(post));
  }

  /* Get post */
  getpost(id: string) {
    return from(this.db.collection('posts').snapshotChanges());
  }

  /* Get post list */
  getpostList() {
    return from(this.db.collection('posts').snapshotChanges());
  }

  /* Update post */
  Updatepost(id, post: Post) {
    return this.db
      .collection('posts')
      .doc(id)
      .set(post);
  }

  /* Delete post */
  Deletepost(id: string) {
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
