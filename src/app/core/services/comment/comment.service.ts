import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of, forkJoin, Observable } from "rxjs";
import { AuthService } from "@app/core/services/auth/auth.service";
import { mergeMap, concatMap, finalize } from "rxjs/operators";
import { Comment } from "../../../shared/models/comment";
import { Post } from '@app/shared/models/post';
import { Like } from '@app/shared/models/like';
import { SubComment } from '@app/shared/models/sub-comment';
import { HelperService } from '@app/core/services/helper/helper.service';
import { SubCommentService } from '@app/core/services/sub-comment/sub-comment.service';
import { LikeService } from "@app/core/services/like/like.service";

@Injectable({
  providedIn: "root"
})
export class CommentService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private helperService: HelperService,
    private subCommentService: SubCommentService,
    private likeService: LikeService
  ) { }

  getComments(postId) {
    const path = this.getPath(postId);
    return this.db
      .collection<Post | Comment>(path).get();
  }

  getPath(postId: string) {
    let path
    if(postId) {
      path = `posts/${postId}/comments/`
    }
    return path;
  }

  addComment(postId, commentDTO: Comment) {
    const id = this.db.createId();
    // Post detail
    commentDTO.commentId = id;
    const path = this.getPath(postId);
    const query = this.db
    .collection<Post | Comment>(path).doc(commentDTO.commentId).set(commentDTO);
    return of(query);
  }

  updateComment(postId: string, commentId: string, commentDTO: Comment) {
    const path = this.getPath(postId);
    const query = this.db
    .collection<Post | Comment>(path).doc(commentId).update(commentDTO);
    return of(query);
  }

  deleteComment(postId: string, commentId: string) {
    const path = this.getPath(postId);
    const ref = this.db
    .collection<Post | Comment>(path).doc(commentId);
    const query = this.subCommentService.removeSubCommentAll(postId, commentId).pipe(concatMap(res => {
      return forkJoin([
        from(ref.delete()),
        from(this.helperService.deleteCollection(ref.collection<Like>('likes')))
      ]);
    }))
    return query;
  }

  removeCommentAll(postId: string) {
    const path = this.getPath(postId);
    const ref = this.db.collection<Post | Comment>(path);
    const query = ref.get().pipe(
      concatMap(results => {
        this.logger.info("### reuslts in removeCommentAll", results);
        let requests: Array<Observable<number>>;
        if (results.docs.length) {
          requests = results.docs.map(c => {
            const comment = { ...c.data() };
            const request = this.likeService.getLikesRef(comment, 2);
            return from(this.helperService.deleteCollection(request));
          });
          return forkJoin(requests);
        }
        return of(null);
      }),
      concatMap(results => {
        this.logger.info("### removeSubCommentAll", results);
        if(results) {
          return forkJoin(
            from(this.helperService.deleteCollection(ref)),
            from(this.helperService.deleteCollection(ref.doc(postId).collection<Like>('likes'))),
            );
        }
        else {
          return of(null);
        }
      })
    );
    return query;
  }

  getNumOfComments(postId: string) {
    const path = this.getPath(postId);
    return this.db
    .collection<Post | Comment>(path).get();
  }
  
  /* getCommentsByUid(uid) {
    return this.db
      // .collection<Post>('posts').doc(postId)
      .collection<Comment>('comments', ref => ref.where('author.uid', '==', uid)).valueChanges();
  } */
}
