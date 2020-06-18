// angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// Boostrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatInputModule,
  MatSliderModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';
// User
import { UserRoutingModule } from './user-routing.module';
import { PostModule } from '@app/components/posts/post.module';
import { UserComponent } from './user.component';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { PostStateService } from '@app/components/posts/post-state.service';
@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
    UserRoutingModule,
    PostModule,
    PipesModule
  ],
  exports: [
    UserComponent
  ],
  providers: [
    PostStateService
  ]
})
export class UserModule {}
