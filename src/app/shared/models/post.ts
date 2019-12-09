import { User } from '@app/shared/models/user';
import { Comment } from '@app/shared/models/comment';
export interface Post {
  postId?       : string;
  title         : string;
  createdAt     : string;
  updatedAt?    : string;
  photoURL?     : string;
  author        : User;
  content       : string;
  categoryId    : string;
  tagIds        : string;
  replies?      : number;
  comments      : Array<string>;
  likes?       : Array<string>;
  views?        : number;
}

// get comments by post id
