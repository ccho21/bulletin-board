// angular
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

//Boostrap
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

// material
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  MatButtonModule,
  MatInputModule,
  MatSliderModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from "@angular/material";

// Posts
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostNewComponent } from './post-new/post-new.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostService } from './shared/post.service';
import { PostRoutingModule } from './post-routing.module';
import { DateFormatPipe } from '@app/core/pipes/date-format.pipe';
import { CommentsComponent } from '@app/containers/posts/post-detail/comments/comments.component';
import { LikeService } from '@app/core/services/like/like.service';

@NgModule({
  declarations: [
    PostDetailComponent,
    PostNewComponent,
    PostEditComponent,
    PostListComponent,
    CommentsComponent,
    DateFormatPipe,
  ],
  entryComponents: [
    PostListComponent
  ],
  imports: [
    PostRoutingModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
  ],
  providers: [NgbActiveModal, PostService, LikeService],
  bootstrap: [PostListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostModule { }
