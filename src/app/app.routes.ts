import { Routes } from '@angular/router';
// import { AuthGuard } from "../../shared/guard/auth.guard";

import { HomeComponent } from './containers/home/home.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';

// Import all the components for which navigation service has to be activated 
// import { SignupComponent } from './examples/signup/signup.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

// import { DashboardComponent } from '../../components/dashboard/dashboard.component';
// import { AuthGuard } from "../../shared/guard/auth.guard";



export const rootRouterConfig: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'nucleoicons',      component: NucleoiconsComponent },
  
  // { path: 'signup',           component: SignupComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'signup',      component: SignUpComponent },
];
  