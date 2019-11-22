export interface Post {
  $key?: number;
  title: string;
  createdAt: Date;
  updtedAt?: Date;
  photoURL?: string;
  Author?;
  content: string;
}
