import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuard } from '@app/core/guard/auth.guard';
import { SignUpComponent } from '@app/components/sign-up/sign-up.component';
// Import all the components for which navigation service has to be activated

export const mainRouterConfig: Routes = [
    {
        path: 'home', component: MainComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', loadChildren: () => import('@app/components/posts/post.module.ts').then(mod => mod.PostModule) },
        ]
    }
];
