import { User } from './user';
import { Post } from './post';
import { Comment } from './comment';

export interface Like {
    likeId?: string;
    type   : number; // enum value 1: post, 2: comment
    user : User;
    commentId?: string; 
    postId?: string;
}