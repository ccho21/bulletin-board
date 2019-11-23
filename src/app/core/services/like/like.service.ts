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
    this.db.collection<Like>('likes').doc(id).set(data);
  }
  getLikesByUserId(type: number): Observable<any> { // by current user id
    const { uid } = this.authService.getCurrentUser();
    this.logger.info('### uid', uid);
    const query = this.db.collection('likes', ref =>
      ref.where("user.uid", "==", `${uid}`).where('type', '==', type)).valueChanges()
      .pipe(mergeMap(res => {
        this.logger.info('111?', res);
        return res;
      }));
    return query;
  }

  isLiked(postId, type) { // get data from current User Id and match with post id. 
    const query = this.getLikesByUserId(type);
    query.subscribe(res => {
      this.logger.info('working?');
      this.logger.info('111',res);
    });
  }

  deleteLike(postId: string, type: number) {
    // const query = this.db.collection<Like>('likes').valueChanges();
    // query.subscribe(res => {
    //   this.logger.info('deleted', res);
    // })
    const query = this.getLikesByUserId(type);
    this.logger.info(query);
    query.pipe(mergeMap(res => {
      this.logger.info('##### ,', res);
      const data = res.length ? res[0] : null;
      return of(data);
    })).subscribe((res: any) => {
      this.logger.info('mergemap 1', res);
      this.db.doc(`likes/${res.likeId}`).delete();
      /*  if(res) {
        const likeId = res.likeId;
        this.db.collection('likes').doc(likeId).delete().then(res => {
          this.logger.info('### deleted success', res);
        }, err => this.logger.info(err));
      } */
    });
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
