import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { RouterModule } from '@angular/router';

import {
  MatButtonModule,
  MatInputModule,
  MatSliderModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { NouisliderModule } from 'ng2-nouislider';
import { PopupService } from '@app/core/services/popup/popup.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from '../containers/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from '../containers/auth/verify-email/verify-email.component';
import { SpinnerComponent } from './spinner/spinner.component';

// infinite scrolling
import { AtomSpinnerModule } from 'angular-epic-spinners';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NouisliderModule,
    RouterModule,
    JwBootstrapSwitchNg2Module,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    AtomSpinnerModule
  ],
  declarations: [
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    SignInComponent,
    SpinnerComponent,

  ],
  entryComponents   : [SignInComponent, SignUpComponent],
  exports           : [SpinnerComponent],
  providers         : [PopupService]
})
export class ComponentsModule {}
