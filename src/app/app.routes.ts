import { Routes } from '@angular/router';
// import { AuthGuard } from "../../shared/guard/auth.guard";

import { HomeComponent } from './containers/home/home.component';
// Import all the components for which navigation service has to be activated 
// import { SignupComponent } from './examples/signup/signup.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { SecureInnerPagesGuard } from './shared/guard/secure-inner-pages.guard';



export const rootRouterConfig: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // { path: 'signup',           component: SignupComponent },
  { path: 'sign-in', component: SignInComponent, canActivate: [SecureInnerPagesGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },
  
];
  
const routes: Routes = [
];