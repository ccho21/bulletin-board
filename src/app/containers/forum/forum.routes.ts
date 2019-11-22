import { Routes } from "@angular/router";
import { ForumComponent } from "./forum.component";
import { PostComponent } from "./post/post.component";
import { PostsComponent } from "./posts/posts.component";
import { EditPostComponent } from "./edit-post/edit-post.component";
import { CreatePostComponent } from "./create-post/create-post.component";
import { DeletePostComponent } from "./delete-post/delete-post.component";

// Import all the components for which navigation service has to be activated

export const forumRouterConfig: Routes = [
  {
    path: "forum",
    component: ForumComponent,
    children: [
      { path: "", redirectTo: 'posts', pathMatch: 'full' },
      { path: ":id", component: PostComponent },
      { path: "create", component: CreatePostComponent },
      { path: "delete", component: DeletePostComponent },
      { path: ":id/edit", component: EditPostComponent }
    ]
  }
];
