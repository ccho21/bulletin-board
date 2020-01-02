// angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlnRichEditorComponent } from './fln-rich-editor.component';
@NgModule({
  declarations: [
    FlnRichEditorComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    QuillModule,
  ],
  exports: [
    FlnRichEditorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FlnRichEditorModule { }
