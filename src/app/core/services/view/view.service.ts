import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Like } from '@app/shared/models/like';
import { Post } from '@app/shared/models/post';
import { AuthService } from '../auth/auth.service';
import { PostService } from '@app/containers/posts/shared/post.service';


@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private postService: PostService
  ) { }
  addView(post:Post, uid) {
    const viewId = this.db.createId();
    const postId = post.postId;
    const postViews = post.hasOwnProperty('views') ? post.views : 0;
    const view = {
      viewId,
      postId,
      uid,
      postViews,
    }
    const query = this.db.collection<Like>('views').doc(viewId).set(view)
    of(query).subscribe(res => {
      this.logger.info('seccessfully view is added to its table');
      this.postService.updatePostViews(post);
    });
  }
  checkViewed(post: Post) {
    // postID, userID,
    // view tables does not have user id on post id, 
    // add it.
    const { uid } = this.authService.getCurrentUser();
    const query = this.db.collection('views', ref =>
      ref.where('uid', '==', uid).where('postId', '==', post.postId)).valueChanges().subscribe(res => {
        this.logger.info('view ??', res);
        if(res.length === 0) {
          this.addView(post, uid);
        } else {

        }
      });
  }
}
