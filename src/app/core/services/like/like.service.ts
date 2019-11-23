import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of, Observable } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';
import { Like } from '@app/shared/models/like';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  likes
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService
  ) { }

  addLike(data: Like) {
    const id = this.db.createId();
    data.likeId = id;
    const query = this.db.collection<Like>('likes').doc(id).set(data);
    return of(query);
  }
  getLikesByUserId(type: number) { // by current user id
    const { uid } = this.authService.getCurrentUser();
    const query = this.db.collection('likes', ref =>
      ref.where("user.uid", "==", `${uid}`).where('type', '==', type)).valueChanges();
    return query;
  }

  isLiked(postId, type) { // get data from current User Id and match with post id. 
    const query = this.getLikesByUserId(type).pipe(mergeMap(results => {
      const data = results.find((result: Like) => result.post.postId === postId);
      return of(data);
    }));
    return query;
  }

  deleteLike(like: Like) {
    const query = this.db.collection('likes').doc(like.likeId).delete();
    return of(query);
  }


  getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));

    // Restoring likes from the localStorage
    if (storage) this.likes = storage;
  }
}
