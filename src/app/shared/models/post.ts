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
  comments?     : Comment[];
  likes?        : number;
  views?         : number;
}

// get comments by post id
