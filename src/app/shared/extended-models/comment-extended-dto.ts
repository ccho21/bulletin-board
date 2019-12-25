import { User } from '@app/shared/models/user';

export interface CommentExtendedDTO {
    commentId?          : string;
    comment             : string;
    createdAt           : string;
    updatedAt?          : string;
    author              : User;
    depth?              : number;
    postId?             : string;
    isLiked             : boolean;
}