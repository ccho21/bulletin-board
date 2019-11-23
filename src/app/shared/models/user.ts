import { Post } from '@app/containers/posts/post';
import { Comment } from '@app/containers/posts/post-detail/comments/comment';
export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    likePosts?: Post[];
    listComments?: Comment[];
}
