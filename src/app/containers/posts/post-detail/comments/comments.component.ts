import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { AuthService } from "@app/core/services/auth/auth.service";
import { UploadService } from "@app/core/services/upload/upload.service";
import { CommentService } from "./comment.service";
import { User } from "@app/shared/models/user";
import { Post } from "../../../../shared/models/post";
import { Comment } from "@app/shared/models/comment";
@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit, OnChanges {
  commentForm: FormControl;
  comment: Comment;
  commentList: Comment[] = [];
  updatedCommentList = [];
  addCommentValid: boolean;
  @Input() post: Post;
  // @Output() commentEmit: EventEmitter<Comment> = new EventEmitter();
  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private commentService: CommentService,
  ) {}

  ngOnInit() {
    this.commentForm = new FormControl("");
    this.logger.info("### ngOnInit in comments");
   
  }
  ngOnChanges(changes: SimpleChanges) {
    // const data = changes.post.currentValue;
    // this.post = data;
    this.initComments(this.post);
  }

  initComments(post: Post) {
    this.logger.info('post', post);
    this.commentService.getComments(post.postId).subscribe(res => {
      this.logger.info('### get comments', res);
      const data = res;
      if (data.length) {
        this.commentList = data.map((comment: Comment) => {
          return comment;
        });
      }
    });
  }

  //  Comment
  addComment(comment) {
    const postId = this.post.postId;
    comment.postId = postId;
    this.commentService.addComment(comment).subscribe(res => {
      this.logger.info("### a comment was succesfully added", comment);
    });
  }
  
  // *** SUB COMMENTS ***
  updateSubcomment(sub, main) {
    this.logger.info("this is subcomment", sub);
    this.logger.info("this is main comment", main);
    this.commentService.updateSubComment(sub, main);
  }

  //  ***  SUBMIT ***
  onSubmit() {
    if (!this.commentForm.valid) {
      return;
    }
   
  }
  addReply(comment: Comment) {
    this.logger.info("comment", comment);
    // comment.addCommentValid = !comment.addCommentValid;
    
  }

  // *** HELPER ***
  getCurrentUser() {
    const {
      displayName,
      uid,
      photoURL,
      email,
      emailVerified
    } = this.authService.getCurrentUser();
    const user: User = { displayName, uid, photoURL, email, emailVerified };
    return user;
  }
  cleanUp(data) {
    const copiedData = Object.assign({}, data);
    if (copiedData.hasOwnProperty("author")) {
      delete copiedData.author;
    }
    return copiedData;
  }
}

  // updatecomment,
  // add commnet
  // likes also goes to ites component
  // it should be imported whenever we need
  // comment should be separated from posts
  // ex) comments : post id, and comments:[], etc

  // *** LIKE *** //
  /* isLiked(post) {
    const { uid } = this.authService.getCurrentUser();
    this.likeService
      .getLikesByData(post.postId, 2)
      .pipe(take(1))
      .subscribe(results => {
        // O(N+M)
        if (this.commentList) {
          this.updatedCommentList = this.commentList.map((comment: Comment) => {
            const valid = results.some(
              (like: Like) => comment.commentId === like.commentId
            );
            return { ...comment, isLiked: valid };
          });
        }
        this.logger.info("### updated comment list", this.updatedCommentList);
      });
  } */

  /* addLike(data) {
    // go to remove like if it is already there
    if (data.isLiked) {
      this.deleteLike(data);
      return;
    }
    const comment = this.cleanUp(data);
    const user = this.getCurrentUser();
    const postId = this.post.postId;
    const likeDTO: Like = {
      type: 2,
      commentId: comment.commentId,
      user,
      postId
    };

    this.likeService.addLike(likeDTO).subscribe(res => {
      this.logger.info("### successfully liked ");
      data.isLiked = true;
    });
  }
  deleteLike(comment) {
    this.likeService.deleteLike(comment.commentId, 2).subscribe(res => {
      this.logger.info("### like successfully deleted");
      comment.isLiked = false;
    });
  } */