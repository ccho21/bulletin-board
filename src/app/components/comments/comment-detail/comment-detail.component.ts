import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { CommentService } from '@app/core/services/comment/comment.service';
import { Comment } from '@app/shared/models/comment';
import { Post } from '@app/shared/models/post';

import { Subscription, of, from, forkJoin } from 'rxjs';
import { toArray, concatMap } from 'rxjs/operators';
import { PostStateService } from '@app/components/posts/post-state.service';
import { ModalService } from '@app/core/services/modal/modal.service';
import { AuthService } from '@app/core/services/auth/auth.service';

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
  isCommentVisible = false;
  subCommentList: Array<Comment> = [];

  isAuthor: boolean;

  constructor(
    private logger: LoggerService,
    private commentService: CommentService,
    private postStateService: PostStateService,
    private modalService: ModalService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.commentForm = new FormControl('');
    const isLoggedIn = this.postStateService.getLogginStatus();
    if (isLoggedIn) {
      if (this.comment) {
        this.isAuthor = this.isUserAuthor(this.comment);
        this.logger.info('### is author', this.isAuthor);
      }
    }
  }

  isUserAuthor(comment: Comment): boolean {
    const { uid } = this.authService.getCurrentUser();
    const authorUid = comment.author.uid;
    return uid === authorUid ? true : false;
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
    this.commentService.deleteComment({ ...comment }).subscribe(res => {
      this.logger.info('comment is successfully deleted', res);
      // update post
    });
  }

  addReply(comment) {
    this.logger.info('### comment', comment);
    this.postStateService.updateReplyDTO(comment);
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

  showReplies(e, comment) {
    e.preventDefault();
    this.isCommentVisible = !this.isCommentVisible;
    if (this.isCommentVisible) {
      if (!(this.subCommentList.length > 0)) {
        this.generateSubComments(comment);
      }
    }
  }
  generateSubComments(comment) {
    this.subCommentList = comment.comments;
    this.logger.info('sub comment list', this.subCommentList);
  }

  openActionModal(component) {
    this.modalService.openSmallCentered(component);
  }
}

enum COMMENT {
  COMMENT = 1,
  SUB_COMMENT = 2
}
