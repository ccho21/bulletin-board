import { Injectable } from "@angular/core";
import { Post } from '@app/shared/models/post';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { User } from '@app/shared/models/user';
import { Like } from '@app/shared/models/like';
import { PostExtendedDTO } from '@app/shared/extended-models/post-extended-dto';
import { Comment } from "@app/shared/models/comment";

@Injectable({
    providedIn: "root"
})
export class PostStateService {
    private posts: Array<PostExtendedDTO>;
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
}

