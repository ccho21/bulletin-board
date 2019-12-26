import { Injectable, OnDestroy } from "@angular/core";
import { Post } from '@app/shared/models/post';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { User } from '@app/shared/models/user';
import { Like } from '@app/shared/models/like';
import { PostExtendedDTO } from '@app/shared/extended-models/post-extended-dto';
import { Comment } from "@app/shared/models/comment";
import { Subject } from 'rxjs';
@Injectable({
    providedIn: "root"
})
export class PostStateService {
    private posts: Array<PostExtendedDTO>;

    private commentSubject = new Subject<Comment>();
    private commentSubjectSubscription$ = this.commentSubject.asObservable();
    
    private replySubject = new Subject<Comment>(); 
    private replySubjectSubscription$ = this.replySubject.asObservable();
    
    constructor(
        private logger: LoggerService
    ) { }
    getPosts(): Array<PostExtendedDTO> {
        return this.posts.slice(0);
    }

    setPosts(posts: Post[]): void {
        this.posts = posts.map(post => ({ ...post }));
    }

    getPost(postId): PostExtendedDTO {
        const pIndex = postId ? this.posts.findIndex(post => post.postId === postId) : 0;
        return this.posts.slice(pIndex, pIndex + 1)[0];
    }

    setPost(post: Post) {
        const pIndex = this.posts.findIndex(p => p.postId === post.postId);
        this.logger.info('### posted');
        this.posts[pIndex] = { ...post };
    }

    getComments(postId: string): Array<Comment> {
        const post = this.getPost(postId);
        const comments = post.comments;
        return comments;
    }
    getLikes(postId: string): Array<Like> {
        const post = this.getPost(postId);
        const likes = post.likes;
        return likes;
    }

    updateCommentDTO(commentDTO) {
        this.commentSubject.next(commentDTO);
    }

    getCommentDTO() {
        return this.commentSubjectSubscription$;
    }

    updateReplyDTO(commentDTO) {
        this.replySubject.next(commentDTO);
    }
    
    getReplyDTO() {
        return this.replySubjectSubscription$;
    }
}

