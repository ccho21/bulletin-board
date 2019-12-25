import { Like } from '../models/like';
import { User } from '../models/user';
import { Comment } from '../models/comment';

export interface PostExtendedDTO {
    postId?       : string;
    title?        : string;
    createdAt?    : string;
    updatedAt?    : string;
    photoURL?     : string;
    author?       : User;
    content?      : string;
    categoryId?   : string;
    tagIds?       : string;
    comments?     : Comment[];
    likes?        : Like[];
    views?        : number;
}