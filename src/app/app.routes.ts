import { Routes } from "@angular/router";
// import { AuthGuard } from "../../shared/guard/auth.guard";

import { MainComponent } from "./main/main.component";
// Import all the components for which navigation service has to be activated

import { VerifyEmailComponent } from "./containers/verify-email/verify-email.component";
import { ForgotPasswordComponent } from "./containers/forgot-password/forgot-password.component";
import { AuthGuard } from "./shared/guard/auth.guard";
import { SecureInnerPagesGuard } from "./shared/guard/secure-inner-pages.guard";
import { UserComponent } from './containers/user/user.component';

export const rootRouterConfig: Routes = [
  { path: '', component: MainComponent, pathMatch: 'full' },
  {
    path: "user/:id", component: UserComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: "verify-email-address",
    component: VerifyEmailComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  // { path: '**', component: MainComponent } // temporary
];

const routes: Routes = [];
