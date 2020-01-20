import { Injectable, OnDestroy } from '@angular/core';
import { Post } from '@app/shared/models/post';
import { LoggerService } from '@app/core/services/logger/logger.service';
import { User } from '@app/shared/models/user';
import { Like } from '@app/shared/models/like';
import { PostExtendedDTO } from '@app/shared/extended-models/post-extended-dto';
import { Comment } from '@app/shared/models/comment';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class PostStateService {
    private posts: Array<PostExtendedDTO> = [];

    private commentSubject = new Subject<Comment>();
    private commentSubjectSubscription$ = this.commentSubject.asObservable();

    private replySubject = new Subject<Comment>();
    private replySubjectSubscription$ = this.replySubject.asObservable();

    private postIdSubject = new Subject<any>();
    private postIdSubjectSubscription$ = this.postIdSubject.asObservable();

    private postCloseSubject = new Subject<any>();
    private postCloseSubjectSubscription$ = this.postCloseSubject.asObservable();

    postIndex: number;
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

    setPost(post: Post): number {
        const pIndex = this.posts.findIndex(p => p.postId === post.postId);
        this.logger.info('### posted');
        this.posts[pIndex] = { ...post };
        return pIndex;
    }

    getComments(postId: string): Array<Comment> {
        const post = this.getPost(postId);
        const comments = post.comments;
        return comments;
    }

    getLikesForPost(postId: string): Array<Like> {
        const post = this.getPost(postId);
        const likes = post.likes.filter(like => like.type === 1);
        return likes;
    }

    getLikesForComment(postId: string): Array<Like> {
        const post = this.getPost(postId);
        const likes = post.likes.filter(like => like.type === 2);
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

    postIdEmit(id) {
        this.postIdSubject.next(id);
    }
    postIdEmitted() {
        return this.postIdSubjectSubscription$;
    }

    postCloseEmit(close) {
        this.postCloseSubject.next(close);
    }

    postCloseEmitted() {
        return this.postCloseSubjectSubscription$;
    }

    setPostIndex(postIndex) {
        this.postIndex = postIndex;
    }

    getPostIndex() {
        this.logger.info('### this.post index', this.postIndex);
        return this.postIndex;
    }

    findPostIndex(postId) {
        return this.posts.findIndex(post => post.postId === postId);
    }

    getPostIdList() {
        return this.posts.map(post => post.postId);
    }

    getPostIdByIndex(index) {
        this.logger.info('##### posts', this.posts);
        return this.posts[index].postId;
    }
    getPostListLength() {
        return this.posts.length;
    }
}

