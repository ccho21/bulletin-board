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
    // this.initComments(this.post);
    this.initData(this.post)
  }

  initData(post) {
    this.commentSubscription = this.commentService.getComments(post.postId).subscribe(res => {
      this.logger.info('### get comments', res.docs);
      this.commentList = this.generateComentList(res.docs);
    });
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
    const commentMap = new Map();
    const subCommentMap = new Map();
    const comments: Array<Comment> = [];
  
    data.forEach((c) => {
      console.log('### c' , c.data());
      const d = c.data();
      if (d.depth === 1) {
        commentMap.set(d.commentId, d);
      }
      if (d.depth === 2) {
        subCommentMap.set(d.commentId, d);
      }
    });
    this.logger.info(commentMap);

    // generating keys for sub comment 

    subCommentMap.forEach(sc => {
      this.logger.info(sc);
      const id = subCommentMap.get(sc.parentCommentId);
      this.logger.info(id);
      if (commentMap.get(id)) {
        commentMap.get(id).comments.push(subCommentMap.get(id));
      }
    });

    this.logger.info('### comment Map',commentMap);
    return comments;
  }

  deleteComment(comment): void {
    const postId = this.post.postId;
    this.commentService.deleteComment(postId, comment, this.post).subscribe(res => {
      this.logger.info('comment is successfully deleted', res);
      // update post
      this.initData(this.post);
    });
  }

  addComment(comment): void {
    const postId = this.post.postId;
    const c = {
      postId,
      ...comment
    };
    const commentDTO = this.cleanUp(c);
    this.commentService.addComment(postId, commentDTO, this.post).subscribe(res => {
      this.logger.info("### a comment was succesfully added", res);
      this.closeComment(comment);
       // update post
      this.initData(this.post);
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