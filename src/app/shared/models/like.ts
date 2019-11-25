import { User } from './user';
import { Post } from './post';

export interface Like {
    likeId?: string;
    type   : number; // enum value 1: post, 2: comment
    user : User;
    post?   : Post; // get rid of other linked properties;
    comment?: Comment; 
    postId?: string;
}