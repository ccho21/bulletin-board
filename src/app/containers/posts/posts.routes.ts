import { Routes } from "@angular/router";
// Posts
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostNewComponent } from './post-new/post-new.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostsService } from './shared/posts.service';
import { PostsRoutingModule } from './posts-routing.module';

// Import all the components for which navigation service has to be activated

export const postsRouterConfig: Routes = [
    { path: 'post-list',  redirectTo:'/posts'},
    { path: 'posts',  component: PostListComponent },
    { path: 'posts/create', component: PostNewComponent },
    { path: 'post/:id', component: PostDetailComponent },
    { path: 'post/:id/edit', component: PostEditComponent },

];
