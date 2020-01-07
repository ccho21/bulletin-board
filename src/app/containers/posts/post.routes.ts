import { Routes } from "@angular/router";
// Posts
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostNewComponent } from './post-new/post-new.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostListComponent } from './post-list/post-list.component';
// Import all the components for which navigation service has to be activated

export const postRouterConfig: Routes = [
    { path: 'post-list',  redirectTo:'/posts'},
    { path: 'posts',  component: PostListComponent },
    { path: 'posts/create', component: PostNewComponent },
    { path: 'posts/:id', component: PostDetailComponent},
    { path: 'posts/:id/edit', component: PostEditComponent },
];
