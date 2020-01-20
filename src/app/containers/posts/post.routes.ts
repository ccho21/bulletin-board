import { Routes } from '@angular/router';
// Posts
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostNewComponent } from './post-new/post-new.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostModalComponent } from './post-modal/post-modal.component';
// Import all the components for which navigation service has to be activated

export const postRouterConfig: Routes = [
    { path: 'posts/create', component: PostModalComponent },
    { path: 'posts/:id', component: PostModalComponent },
    { path: 'posts/:id/edit', component: PostEditComponent },
];
