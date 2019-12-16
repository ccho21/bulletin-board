import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of, forkJoin, Observable } from "rxjs";
import { AuthService } from "@app/core/services/auth/auth.service";
import { concatMap } from "rxjs/operators";
import { Comment } from "../../../../shared/models/comment";
import { User } from "@app/shared/models/user";
import { Post } from "@app/shared/models/post";
import { CommentService } from "./comment.service";
import { LikeService } from "@app/core/services/like/like.service";
import { HelperService } from "@app/core/services/helper/helper.service";
import { SubComment } from "@app/shared/models/sub-comment";
import { Like } from "@app/shared/models/like";
@Injectable({
  providedIn: "root"
})
export class SubCommentService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private commentService: CommentService,
    private helperService: HelperService,
    private likeService: LikeService
  ) {}

  getSubComments(comment) {
    return this.db
      .collection<Post>("posts")
      .doc(comment.postId)
      .collection<Comment>("comments")
      .doc(comment.commentId)
      .collection<SubComment>("sub-comments")
      .get();
  }

  addSubComment(mainComment: Comment, subCommentDTO: SubComment) {
    const id = this.db.createId();
    subCommentDTO.subCommentId = id;
    subCommentDTO.commentId = mainComment.commentId;
    subCommentDTO.postId = mainComment.postId;
    this.logger.info("111", mainComment, "222", subCommentDTO);
    const query = this.db
      .collection<Post>("posts")
      .doc(mainComment.postId)
      .collection<Comment>("comments")
      .doc(mainComment.commentId)
      .collection<SubComment>("sub-comments")
      .doc(subCommentDTO.subCommentId)
      .set(subCommentDTO);
    return from(query);
  }

  /*   deleteSubComment(mainComment: Comment, subCommentDTO: SubComment) {
    const query = this.db
      .collection<Post>('posts').doc(mainComment.postId)
      .collection<Comment>('comments').doc(mainComment.commentId)
      .collection<SubComment>('sub-comments').doc(subCommentDTO.subCommentId).delete();
    return from(query);
  } */

  deleteSubComment(mainComment: Comment, subCommentDTO: SubComment) {
    this.logger.info("### yo");
    const ref = this.db
      .collection<Post>("posts")
      .doc(mainComment.postId)
      .collection<Comment>("comments")
      .doc(mainComment.commentId)
      .collection<SubComment>("sub-comments")
      .doc(subCommentDTO.subCommentId);
    const query = from(
      this.helperService.deleteCollection(ref.collection<Like>("likes"))
    ).pipe(
      concatMap(res => {
        this.logger.info("everything is deleted", res);
        return ref.delete();
      })
    );
    return query;
  }

  updateSubComment(commentId: string, subCommentDTO: SubComment) {
    const query = this.db
      .collection<SubComment>("sub-comments", ref =>
        ref.where("commentId", "==", commentId)
      )
      .doc(subCommentDTO.subCommentId)
      .update(subCommentDTO);
    return of(query);
  }

  removeSubCommentAll(postId: string, commentId: string) {
    const ref = this.db
      .collection<Post>("posts")
      .doc(postId)
      .collection<Comment>("comments")
      .doc(commentId)
      .collection<SubComment>("sub-comments");
    const query = ref.get().pipe(
      concatMap(results => {
        this.logger.info("### reuslts in removeSubCommentAll", results);
        let requests: Array<Observable<number>>;
        if (results.docs.length) {
          requests = results.docs.map(sc => {
            const subComment = { ...sc.data() };
            const request = this.likeService.getLikesRef(subComment, 3);
            return from(this.helperService.deleteCollection(request));
          });
          return forkJoin(requests);
        }
        return of(null);
      }),
      concatMap(results => {
        this.logger.info("### removeSubCommentAll", results);
        if(results) {
          return from(this.helperService.deleteCollection(ref));
        }
        else {
          return of(null);
        }
      })
    );
    return query;
  }
}

/* addSubComment(mainComment: Comment, subCommentDTO: SubComment) {
  const id = this.db.createId();
  subCommentDTO.subCommentId = id;
  subCommentDTO.commentId = mainComment.commentId;
  subCommentDTO.postId = mainComment.postId;
  this.logger.info('111', mainComment, '222', subCommentDTO);
  const query = this.db
    .collection<Comment>('comments').doc(mainComment.commentId)
    .collection<SubComment>('sub-comments').doc(subCommentDTO.subCommentId).set(subCommentDTO);
  return of(query).pipe(switchMap(res => {
    const subCommentId = subCommentDTO.subCommentId;
    mainComment.subComments.push(subCommentId);
    const postId = mainComment.postId
    return this.commentService.updateComment(postId, mainComment.commentId, mainComment);
  }));
}

deleteSubComment(mainComment: Comment, subCommentDTO: SubComment) {
  const query = this.db
    .collection<Comment>('comments').doc(mainComment.commentId)
    .collection<SubComment>('sub-comments').doc(subCommentDTO.subCommentId).delete();

  return of(query).pipe(switchMap(res => {
    const mainCommentDTO = { ...mainComment };
    const scIndex = mainCommentDTO.subComments.findIndex(cur => cur === subCommentDTO.subCommentId);
    const postId = mainComment.postId;
    mainCommentDTO.subComments.splice(scIndex, 1);
    return this.commentService.updateComment(postId, mainComment.commentId, mainComment);
  }));;
}
 */
