import { Routes } from '@angular/router';
// import { AuthGuard } from "../../shared/guard/auth.guard";

import { MainComponent } from './main/main.component';
// Import all the components for which navigation service has to be activated

import { VerifyEmailComponent } from './containers/auth/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './containers/auth/forgot-password/forgot-password.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { SecureInnerPagesGuard } from './shared/guard/secure-inner-pages.guard';
import { UserComponent } from './user/user.component';
import { AppComponent } from './app.component';

export const rootRouterConfig: Routes = [
  {
    path: 'user/:id', component: UserComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: 'verify-email-address',
    component: VerifyEmailComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  // { path: '**', component: MainComponent } // temporary
];

const routes: Routes = [];
