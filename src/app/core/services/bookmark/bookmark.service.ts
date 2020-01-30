import { Injectable } from '@angular/core';
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { of, forkJoin, from, Observable, Observer } from 'rxjs';
import { take, concatMap } from 'rxjs/operators';
import { Like } from '@app/shared/models/like';
import { Post } from '@app/shared/models/post';
import { AuthService } from '../auth/auth.service';
import { Comment } from '@app/shared/models/comment';
import { SubComment } from '@app/shared/models/sub-comment';
import { HelperService } from '../helper/helper.service';
import { Bookmark } from '@app/shared/models/bookmark';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private helperService: HelperService
  ) { }

  getBookmarksByUidAndPostId(postId) {
    const { uid } = this.authService.getCurrentUser();
    return this.db.doc(`user-activities/${uid}`)
      .collection<Bookmark>('bookmarks', ref => ref.where('postId', '==', postId).where('uid', '==', uid)).get();
  }
  getBookmarkedPostId(uid) {
    return this.db
      .collectionGroup<Bookmark>('bookmarks', ref => ref.where('uid', '==', uid).orderBy('postId', 'asc')).get().pipe(concatMap(res => {
        const postIds = res.docs.map(cur => cur.data().postId);
        this.logger.info(postIds);
        return of(postIds);
      }));
  }

  addBookmark(postId: string) {
    const { uid } = this.authService.getCurrentUser();
    const bookmarkId = this.db.createId();
    const bookmarkDTO = {
      postId,
      bookmarkId,
      uid
    };
    this.db.doc(`user-activities/${uid}/bookmarks/${bookmarkId}`).set(bookmarkDTO);
    return of(bookmarkDTO);
  }

  removeBookmark(bookmark) {
    const query = this.db.doc(`user-activities/${bookmark.uid}/bookmarks/${bookmark.bookmarkId}`).delete();
    return of(query);
  }
}
