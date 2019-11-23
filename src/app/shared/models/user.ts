import { Post } from '@app/shared/models/post';
import { Comment } from '@app/shared/models/comment';
export interface User {
    uid           : string;
    email         : string;
    displayName   : string;
    photoURL      : string;
    emailVerified : boolean;
    likePosts?    : Array<any>;
    listComments? : Comment[];
    like?         : boolean;
}
