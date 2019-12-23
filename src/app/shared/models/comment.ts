import { User } from '@app/shared/models/user';
import { Reply } from 'app/shared/models/reply';

export interface Comment {
    commentId?          : string;
    comment             : string;
    createdAt           : string;
    updatedAt?          : string;
    author              : User;
    depth?               : number;
    postId?             : string;
}