import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { AuthService } from "@app/core/services/auth/auth.service";
import { UploadService } from "@app/core/services/upload/upload.service";
import { CommentService } from "./comment.service";
import { User } from "@app/shared/models/user";
import { Post } from "../../../../shared/models/post";
import { Comment } from "@app/shared/models/comment";
import { PostService } from '../../shared/post.service';
import { Subscription } from 'rxjs';
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
    private authService: AuthService,
    private commentService: CommentService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.commentForm = new FormControl("");
    this.logger.info("### ngOnInit in comments");
    this.initComments(this.post);
  }

  initComments(post: Post) {
    this.logger.info('post', post);
    this.commentSubscription = this.commentService.getComments(post.postId).subscribe(res => {
      this.logger.info('### get comments', res);
      const data = this.generateComentList(res);
      if (data.length) {
        this.commentList = data.map((comment: Comment) => {
          return comment;
        });
        this.filteredCommentList = this.commentList.map(cur => ({ ...cur }));
        this.logger.info(this.filteredCommentList);
      }
    });
  }

  generateComentList(data): Array<Comment> {
    const commentObj = {};
    const subCommentObj = {};
    const comments: Array<Comment> = [];
    data.forEach((c) => {
      if (c.depth === 1) {
        commentObj[c.commentId] = c;
      }
      if (c.depth === 2) {
        subCommentObj[c.commentId] = c;
      }
    });

    // generating keys for sub comment 
    const keys = Object.keys(subCommentObj);
    this.logger.info('keys ', keys);
    keys.forEach(scId => {
      const id = subCommentObj[scId].parentCommentId;
      this.logger.info(commentObj[id]);
      if (commentObj[id]) {
        if (commentObj[id].hasOwnProperty('comments')) {
          commentObj[id].comments.push(subCommentObj[scId]);
        }
        else {
          commentObj[id].comments = [subCommentObj[scId]];
        }
      }
    });

    // return to array 
    for (const key in commentObj) {
      comments.push(commentObj[key]);
    }
    return comments;
  }

  deleteComment(comment): void {
    const postId = this.post.postId;
    this.commentService.deleteComment(postId, comment).subscribe(res => {
      this.logger.info('comment is successfully deleted', res);
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
    });
  }

  // *** SUB COMMENTS ***
  addSubcomment(sub: Comment, main: Comment): void {
    sub.parentCommentId = main.commentId;
    sub.postId = main.postId;
    if (main.depth) {
      sub.depth = main.depth + 1;
    }
    this.addComment(sub);
  }

  updateComment(commentDTO): void {
    this.logger.info('before update comment', commentDTO);
    const postId = this.post.postId;
    const commentId = commentDTO.commentId;
    commentDTO = this.cleanUp(commentDTO);
    this.commentService.updateComment(postId, commentId, commentDTO).subscribe(res => {
      this.logger.info('### updating comment is successful. ', res);
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

  // COMMENTW WRITE
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
    this.logger.info('## save comment ',this.commentForm.value);
    const newComment = this.commentForm.value;
    const commentDTO = {...comment};
    if(newComment !== comment) {
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