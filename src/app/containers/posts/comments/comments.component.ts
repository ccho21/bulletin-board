import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { AuthService } from "@app/core/services/auth/auth.service";
import { CommentService } from "../../../core/services/comment/comment.service";
import { Post } from "../../../shared/models/post";
import { Comment } from "@app/shared/models/comment";
import { PostService } from '../shared/post.service';
import { Subscription, of, from, forkJoin } from 'rxjs';
import { SubCommentService } from '../../../core/services/sub-comment/sub-comment.service';
import { toArray, concatMap } from 'rxjs/operators';
import { SubComment } from '@app/shared/models/sub-comment';

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit, OnDestroy {
  commentForm: FormControl;
  comment: Comment;
  commentList: Comment[] = [];
  filteredCommentList = [];
  addCommentValid: boolean;
  commentSubscription: Subscription;
  @Input() post: Post;
  // @Output() commentEmit: EventEmitter<Comment> = new EventEmitter();
  constructor(
    private logger: LoggerService,
    private commentService: CommentService,
    private subCommentService: SubCommentService
  ) { }

  ngOnInit() {
    this.commentForm = new FormControl("");
    this.logger.info("### ngOnInit in comments");
    this.initData(this.post)
  }

  initData(post) {
    this.commentSubscription = this.commentService.getComments(post.postId).pipe(concatMap(res => {
      return from(res.docs);
    }), concatMap(res => {
      const data = res.data();
      return forkJoin([of(data),
      this.subCommentService.getSubComments(data)]);
    }), concatMap(results => {
      const data = results[0];
      data.subComments = results[1].docs.map(cur => ({...cur.data()}));
      return of(data);
    }),
      toArray(),
    ).subscribe(res => {
      this.logger.info('### final ', res);
      this.commentList = res.map(cur => ({...cur} as Comment));
    });
  }

  addComment(comment): void {
    const postId = this.post.postId;
    const c = {
      postId,
      ...comment
    };
    const commentDTO = this.cleanUp(c);
    this.commentService.addComment(postId, commentDTO).subscribe(res => {
      this.logger.info("### a comment was succesfully added", res);
      this.closeComment(comment);
      // update post
      this.initData(this.post);
    });
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
      this.initData(this.post);
    });
  }

  // *** SUB COMMENTS ***
  addSubcomment(main: Comment, sub: SubComment): void {
    this.logger.info('### main', main, sub);
    this.subCommentService.addSubComment(main, sub).subscribe(res => {
      this.logger.info('sub comment is successfullt added', res);
      this.initData(this.post);
    });
  }

  deleteSubComment(main: Comment, sub: SubComment): void {
    this.subCommentService.deleteSubComment(main, sub).subscribe(res => {
      this.logger.info('comment is successfully deleted', res);
      // update post
      this.initData(this.post);
    });
  }


  //  ***  SUBMIT ***
  onSubmit(): void {
    if (!this.commentForm.valid) {
      return;
    }
  }

  addReply(comment): void {
    this.logger.info("comment", comment);
    comment.addCommentValid = !comment.addCommentValid;
  }

  // COMMENT WRITE
  openComment(comment): void {
    comment.addCommentValid = true;
  }

  editComment(comment): void {
    comment.editCommentValid = true;
    this.commentForm.patchValue(comment.comment);
  }

  closeComment(comment): void {
    if (comment.addCommentValid) {
      delete comment.addCommentValid;
    }
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

  // HELPER
  cleanUp(data): Comment {
    const copiedData = Object.assign({}, data);
    delete copiedData.editCommentValid;
    delete copiedData.addCommentValid;
    return copiedData;
  }


  ngOnDestroy() {
    this.commentSubscription.unsubscribe();
  }
}