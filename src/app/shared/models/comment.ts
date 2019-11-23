import { User } from '@app/shared/models/user';
import { Post } from '@app/shared/models/post';

export interface Comment {
    commentId?    : string;
    comment       : string;
    createdAt     : string;
    updatedAt?    : string;
    author        : User;
    postId?       : string;
}