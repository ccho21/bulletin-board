import { Routes } from '@angular/router';
// import { AuthGuard } from "../../shared/guard/auth.guard";

import { HomeComponent } from './containers/home/home.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { EditUserResolver } from './users/edit-user/edit-user.resolver';

import { ComponentsComponent } from './components/components.component';
import { ProfileComponent } from './examples/profile/profile.component';
import { LandingComponent } from './examples/landing/landing.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';

// Import all the components for which navigation service has to be activated 
import { SignInComponent } from './shared/popup/sign-in/sign-in.component';
import { SignupComponent } from './examples/signup/signup.component';
import { VerifyEmailComponent } from './shared/popup/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './shared/popup/forgot-password/forgot-password.component';

// import { DashboardComponent } from '../../components/dashboard/dashboard.component';
// import { AuthGuard } from "../../shared/guard/auth.guard";



export const rootRouterConfig: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'new-user', component: NewUserComponent },
  { path: 'details/:id', component: EditUserComponent, resolve:{data : EditUserResolver} },
  { path: 'user-profile',     component: ProfileComponent },
  { path: 'signup',           component: SignupComponent },
  { path: 'landing',          component: LandingComponent },
  { path: 'nucleoicons',      component: NucleoiconsComponent },

  { path: 'sign-in', component: SignInComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent }
];
  