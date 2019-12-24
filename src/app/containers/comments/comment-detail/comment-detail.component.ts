import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { CommentService } from "@app/core/services/comment/comment.service";
import { Comment } from "@app/shared/models/comment";
import { Post } from "@app/shared/models/post";

import { Subscription, of, from, forkJoin } from 'rxjs';
import { toArray, concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss']
})
export class CommentDetailComponent implements OnInit {

  @Input() post: Post;
  @Input() comment: Comment;
  addCommentValid: boolean;
  commentForm: FormControl;
  editCommentValid: boolean;
  constructor(
    private logger: LoggerService,
    private commentService: CommentService,
  ) { }

  ngOnInit() {
    this.commentForm = new FormControl("");
    this.logger.info('### comment !!! ', this.comment);
  }

  updateComment(commentDTO): void {
    const postId = this.post.postId;
    const commentId = commentDTO.commentId;
    commentDTO = this.cleanUp(commentDTO);
    this.commentService.updateComment(postId, commentId, commentDTO).subscribe(res => {
      this.logger.info('### updating comment is successful. ', res);
    });
  }

  deleteComment(comment): void {
    const postId = this.post.postId;
    const commentId = comment.commentId;
    this.commentService.deleteComment(postId, commentId).subscribe(res => {
      this.logger.info('comment is successfully deleted', res);
      // update post
    });
  }

  onSubmit(): void {
    if (!this.commentForm.valid) {
      return;
    }
  }

  // HELPER
  cleanUp(data): Comment {
    const copiedData = Object.assign({}, data);
    delete copiedData.editCommentValid;
    delete copiedData.addCommentValid;
    return copiedData;
  }

  closeComment(comment): void {
    if (comment.addCommentValid) {
      delete comment.addCommentValid;
    }
  }

  // COMMENT WRITE
  openComment(comment): void {
    comment.addCommentValid = true;
  }

  editComment(comment): void {
    comment.editCommentValid = true;
    this.commentForm.patchValue(comment.comment);
  }

  saveComment(comment) {
    this.logger.info('## save comment ', this.commentForm.value);
    const newComment = this.commentForm.value;
    const commentDTO = { ...comment };
    if (newComment !== comment) {
      // updateAt - createdAt = (when it is the last update occured). 
      commentDTO.comment = newComment;
      commentDTO.updatedAt = new Date().toISOString();
      this.updateComment(commentDTO);
    }
    comment.editCommentValid = false;
  }

  addReply(comment): void {
    this.logger.info("comment", comment);
    comment.addCommentValid = !comment.addCommentValid;
  }
}

enum COMMENT {
  COMMENT = 1,
  SUB_COMMENT = 2
}