import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { from, of } from "rxjs";
import { AuthService } from "@app/core/services/auth/auth.service";
import { mergeMap, switchMap } from "rxjs/operators";
import { Comment } from "../../../../shared/models/comment";
import { User } from "@app/shared/models/user";
import { Post } from '@app/shared/models/post';
import { PostService } from '../../shared/post.service';
import { CommentService } from './comment.service';
import { SubComment } from '@app/shared/models/sub-comment';

@Injectable({
  providedIn: 'root'
})
export class SubCommentService {

  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService
  ) { }
  
  getSubComments(commentId) {
    return this.db
      .collection<SubComment>('sub-comments', ref => ref.where('commentId', '==', commentId)).get();
  }

  addSubComment(mainComment: Comment, subCommentDTO: SubComment) {
    const id = this.db.createId();
    subCommentDTO.subCommentId = id;
    subCommentDTO.commentId = mainComment.commentId;
    subCommentDTO.postId = mainComment.postId;
    this.logger.info('111', mainComment, '222',subCommentDTO);
    const query = this.db
      .collection<SubComment>('sub-comments').doc(subCommentDTO.subCommentId).set(subCommentDTO);


    return of(query).pipe(switchMap(res => {
      const subCommentId = subCommentDTO.subCommentId;
      mainComment.subComments.push(subCommentId);
      /* UPDATE POST TO ADD COMMENT ID */
      const postId = mainComment.postId
      return this.commentService.updateComment(postId, mainComment.commentId, mainComment);
    }));
  }

  deleteSubComment(mainComment: Comment, subCommentDTO: SubComment) {
    const query = this.db
      .collection<SubComment>('sub-comments', ref => ref.where('commentId', '==', mainComment.commentId)).doc(subCommentDTO.subCommentId).delete();
    
      return of(query).pipe(switchMap(res => {
       /* UPDATE COMMENT TO SPLICE COMMENT ID */
      const mainCommentDTO = { ...mainComment };
      const scIndex = mainCommentDTO.subComments.findIndex(cur => cur === subCommentDTO.subCommentId);
      const postId = mainComment.postId;
      mainCommentDTO.subComments.splice(scIndex, 1);
      return this.commentService.updateComment(postId, mainComment.commentId, mainComment);
    }));;
  }
  
  updateSubComment(commentId: string, subCommentDTO: SubComment) {
    const query = this.db
      .collection<SubComment>('sub-comments', ref => ref.where('commentId', '==', commentId)).doc(subCommentDTO.subCommentId)
      .update(subCommentDTO);
      return of(query);
  }

}
