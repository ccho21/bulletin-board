import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from "@angular/core";
import { LoggerService } from "@app/core/services/logger/logger.service";
import { CommentService } from '@app/core/services/comment/comment.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Post } from "@app/shared/models/post";
import { Comment } from "@app/shared/models/comment";
import { User } from "@app/shared/models/user";
import { Subscription, forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { LikeService } from '@app/core/services/like/like.service';
import { PostStateService } from '@app/containers/posts/post-state.service';
import { Like } from '@app/shared/models/like';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit, OnDestroy {
  
  comment: Comment;
  user: User;
  commentList: Array<Comment> = [];
  addCommentValid: boolean;
  commentSubscription: Subscription;
  commentForm;
  likeList: Array<Like> = [];
  @Input() post: Post;
  constructor(
    private logger: LoggerService,
    private commentService: CommentService,
    private authService: AuthService,
    private likeService: LikeService,
    private postStateService: PostStateService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.commentForm = new FormControl('');
    this.logger.info(this.post);
    this.getComments(this.post);
  }

  getComments(post) {
    const postId = post.postId;
    this.commentList = this.postStateService.getComments(postId);    
  }

   // HELPER
   cleanUp(data): Comment {
    const copiedData = Object.assign({}, data);
    delete copiedData.editCommentValid;
    delete copiedData.addCommentValid;
    return copiedData;
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