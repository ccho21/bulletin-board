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
    keys.forEach(scId => {
      const id = subCommentObj[scId].parentCommentId;
      if (commentObj[id].hasOwnProperty('comments')) {
        commentObj[id].comments.push(subCommentObj[scId]);
      }
      else {
        commentObj[id].comments = [subCommentObj[scId]];
      }
    });

    // return to array 
    for(const key in commentObj) {
      comments.push(commentObj[key]);
    }
    return comments;

  }
  deleteComment(comment): void {
    const postId = this.post.postId;
    this.commentService.deleteComment(postId, comment).subscribe(res => {
      this.logger.info('comment is successfully deleted', res);
      // comment.replies = comment.replies - 1;
      // this.postService.updatePost(postId, comment);
    });
  }

  addComment(comment) : void {
    const postId = this.post.postId;
    comment.postId = postId;
    this.closeComment(comment);
    this.commentService.addComment(postId, comment).subscribe(res => {
      this.logger.info("### a comment was succesfully added", comment);
      // comment.replies = comment.replies + 1;
      // this.postService.updatePost(postId, comment);
    });
  }

  // *** SUB COMMENTS ***
  addSubcomment(sub: Comment, main: Comment) : void {
    const postId = main.postId;
    sub.parentCommentId = main.commentId;
    sub.postId = postId;
    if (main.depth) {
      sub.depth = main.depth + 1;
    }
    this.commentService.addComment(postId, sub);
  }

  updateComment(comment): void {
    // let depth: number;
    // this.closeComment(comment);
    // this.commentService.addComment(comment);
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

  cleanUp(data): Comment {
    const copiedData = Object.assign({}, data);
    if (copiedData.hasOwnProperty("author")) {
      delete copiedData.author;
    }
    return copiedData;
  }

  // COMMENTW WRITE
  openComment(comment): void {
    comment.addCommentValid = true;
  }

  editComment(comment): void {
    this.openComment(comment);
  }

  closeComment(comment): void {
    if (comment.addCommentValid) {
      delete comment.addCommentValid;
    }
  }

  ngOnDestroy() {
    this.commentSubscription.unsubscribe();
  }
}