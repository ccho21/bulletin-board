import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogginPopupComponent } from './loggin-popup/loggin-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupService } from '@app/services/popup/popup.service';
@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        LogginPopupComponent,
    ],
    providers: [
        PopupService,
      ],
      entryComponents : [
          LogginPopupComponent
      ]
})
export class PopupModule { }
