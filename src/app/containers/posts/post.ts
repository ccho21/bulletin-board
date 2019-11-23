import { User } from '@app/shared/models/user';
import { Comment } from '@app/containers/posts/post-detail/comments/comment';
export interface Post {
  postId?: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  photoURL?: string;
  author: User;
  content: string;
  comments?: Comment[];
  likes?: User[];
}

// get comments by post id
