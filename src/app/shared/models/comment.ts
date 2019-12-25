import { User } from '@app/shared/models/user';

export interface Comment {
    commentId?          : string;
    comment             : string;
    createdAt           : string;
    updatedAt?          : string;
    author              : User;
    depth?              : number;
    postId?             : string;
}