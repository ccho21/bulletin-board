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

  @Input() post;

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

    this.commentSubscription = this.postStateService.getCommentDTO().subscribe(res => {
      this.logger.info('### COMMMENT DTO BEFORE ADDED', res);
      this.addComment(res);
    })
  }

  getComments(post) {
    const postId = post.postId;
    const comments = this.postStateService.getComments(postId);
    const cMap = new Map();
    const scMap = new Map();
    this.logger.info('### COMMMENTS', this.commentList);

    // saparate sub comments and main comments.
    comments.forEach(comment => {
      if (comment.hasOwnProperty('commentTo')) {
        scMap.set(comment.commentId, comment);
      }
      else {
        cMap.set(comment.commentId, comment);
      }
    });

    // put sub comments under the main comments
    Array.from(scMap).map(subComment => {
      const cId = subComment[1].commentTo.commentId;
      const mainComment = cMap.get(cId);
      if (mainComment) {
        if (mainComment.hasOwnProperty('comments')) {
          mainComment.comments.push(subComment[1]);
        }
        else {
          mainComment.comments = [subComment[1]];
        }
      }
    })
    this.logger.info('###', cMap);
    this.commentList = Array.from(cMap).map(c => ({ ...c[1] }));
    this.logger.info('###', this.commentList);
  }

  // HELPER
  cleanUp(data): Comment {
    const copiedData = Object.assign({}, data);
    delete copiedData.editCommentValid;
    delete copiedData.addCommentValid;
    return copiedData;
  }

  addComment(comment): void {
    this.logger.info('### came comment');
    const postId = this.post.postId;
    const commentDTO = this.cleanUp({
      postId,
      ...comment,
    });
    if (commentDTO.hasOwnProperty('commentTo') && commentDTO.hasOwnProperty('commentTag')) {
      commentDTO.depth = COMMENT.SUB_COMMENT;
    }

    this.logger.info('### commentDTO', commentDTO);
    this.commentService.addComment(commentDTO).subscribe(res => {
      if(res.hasOwnProperty('parentCommentId')) {
        this.commentList = this.commentList.map(comment => {
          if(comment.commentId === res.parentCommentId) {
              comment.comments.push({...res});
          }
          return comment;
        });
      } else {
        this.commentList.push(res); 
        this.post.comments = this.commentList;
      }
      this.postStateService.setPost({ ...this.post });
      this.logger.info('### FINAL CHECK ', this.commentList);
    });
  }

  ngOnDestroy() {
    if (this.commentSubscription) {
      this.commentSubscription.unsubscribe();
    }
  }
}

enum COMMENT {
  COMMENT = 1,
  SUB_COMMENT = 2
}