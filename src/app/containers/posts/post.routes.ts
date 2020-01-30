import { Routes } from '@angular/router';
// Posts
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostModalComponent } from './post-modal/post-modal.component';
// Import all the components for which navigation service has to be activated

export const postRouterConfig: Routes = [
    {
        path: 'p', component: PostListComponent, children: [
            { path: 'create', component: PostModalComponent },
            { path: ':id', component: PostModalComponent },
            { path: ':id/edit', component: PostEditComponent },
        ]
    },

    // { path: 'p/create', component: PostModalComponent },
    // { path: 'p/:id', component: PostModalComponent },
    // { path: 'p/:id/edit', component: PostEditComponent },
];
