import { User } from '@app/shared/models/user';
import { Reply } from 'app/shared/models/reply';

export interface SubComment {
    subCommentId?          : string;
    comment             : string;
    createdAt           : string;
    updatedAt?          : string;
    author              : User;
    postId?             : string;
    commentId?          : string;
    likes               : Array<string>;
}