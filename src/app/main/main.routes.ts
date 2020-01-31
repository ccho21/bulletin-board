import { Routes } from '@angular/router';
import { MainComponent } from './main.component';

// Import all the components for which navigation service has to be activated

export const mainRouterConfig: Routes = [
    {
        path: 'home', component: MainComponent , children: [
            { path: '', loadChildren: () => import('@app/containers/posts/post.module.ts').then(mod => mod.PostModule) },
        ]
    },
];
