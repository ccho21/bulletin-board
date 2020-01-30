import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
// Posts

// Import all the components for which navigation service has to be activated

export const userRouterConfig: Routes = [
    {
        path: 'user/:id', component: UserComponent, children: [
            { path: '', loadChildren: () => import('@app/containers/posts/post.module.ts').then(mod => mod.PostModule) },
        ]
    },
];
