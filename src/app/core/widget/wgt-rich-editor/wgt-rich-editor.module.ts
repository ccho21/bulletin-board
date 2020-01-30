// angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WgtRichEditorComponent } from './wgt-rich-editor.component';
@NgModule({
  declarations: [
    WgtRichEditorComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    QuillModule,
  ],
  exports: [
    WgtRichEditorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WgtRichEditorModule { }
