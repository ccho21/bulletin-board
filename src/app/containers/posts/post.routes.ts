import { Routes } from '@angular/router';
// Posts
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostModalComponent } from './post-modal/post-modal.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
// Import all the components for which navigation service has to be activated

export const postRouterConfig: Routes = [
    { path: 'p/create', component: PostModalComponent },
    { path: 'p/:id', component: PostDetailComponent},
    { path: 'p/:id/edit', component: PostEditComponent },
];
