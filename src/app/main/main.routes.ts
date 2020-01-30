import { Routes } from '@angular/router';
// Posts
import { PostDetailComponent } from '../containers/posts/post-detail/post-detail.component';
import { PostNewComponent } from '../containers/posts/post-new/post-new.component';
import { PostEditComponent } from '../containers/posts/post-edit/post-edit.component';
import { PostListComponent } from '@app/containers/posts//post-list/post-list.component';
import { PostModalComponent } from '@app/containers/posts/post-modal/post-modal.component';
import { MainComponent } from './main.component';

// Import all the components for which navigation service has to be activated

export const mainRouterConfig: Routes = [
    {
        path: 'home', component: MainComponent, children: [
            { path: '', loadChildren: () => import('@app/containers/posts/post.module.ts').then(mod => mod.PostModule) },
        ]
    },
];
