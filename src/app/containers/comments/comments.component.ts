import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from "@angular/core";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { CommentService } from '@app/core/services/comment/comment.service';
import { Post } from "@app/shared/models/post";
import { Comment } from "@app/shared/models/comment";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit, OnDestroy {
  
  comment: Comment;
  commentList: Comment[] = [];
  filteredCommentList = [];
  addCommentValid: boolean;
  commentSubscription: Subscription;
  @Input() post: Post;
  constructor(
    private logger: LoggerService,
    private commentService: CommentService,
  ) { }

  ngOnInit() {
    this.getComments(this.post);
  }

  getComments(post) {
    const postId = post.postId;
    this.commentSubscription = this.commentService.getComments(postId).subscribe(results => {
      this.commentList = results.docs.map(cur => ({...cur.data()} as Comment));
      this.logger.info('commentList', this.commentList);
    });
  }

  addComment(comment): void {
    const postId = this.post.postId;
    const depth = COMMENT.COMMENT;
    const commentDTO = this.cleanUp({
      postId,
      ...comment,
      depth
    });
    this.commentService.addComment(postId, commentDTO).subscribe(res => {
      this.logger.info("### a comment was succesfully added", res);
      // update post
    });
  }

   // HELPER
   cleanUp(data): Comment {
    const copiedData = Object.assign({}, data);
    delete copiedData.editCommentValid;
    delete copiedData.addCommentValid;
    return copiedData;
  }
  // *** SUB COMMENTS ***

  /* addSubcomment(main: Comment, sub: SubComment): void {
    this.logger.info('### main', main, sub);
    this.subCommentService.addSubComment(main, sub).subscribe(res => {
      this.logger.info('sub comment is successfullt added', res);
    });
  }

  deleteSubComment(main: Comment, sub: SubComment): void {
    this.subCommentService.deleteSubComment(main, sub).subscribe(res => {
      this.logger.info('comment is successfully deleted', res);
      // update post
    });
  } */


  //  ***  SUBMIT ***
  
  ngOnDestroy() {
    if(this.commentSubscription) {
      this.commentSubscription.unsubscribe();
    }
  }
}

enum COMMENT {
  COMMENT = 1,
  SUB_COMMENT = 2
}