import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogginPopupComponent } from './loggin-popup/loggin-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupService } from '@app/core/services/popup/popup.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        LogginPopupComponent,
        SignInComponent,
        SignUpComponent,
        ForgotPasswordComponent,
        VerifyEmailComponent,
    ],
    providers: [
        PopupService,
      ],
      entryComponents : [
          LogginPopupComponent
      ]
})
export class PopupModule { }
