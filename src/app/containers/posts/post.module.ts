// angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Boostrap
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatButtonModule,
  MatInputModule,
  MatSliderModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';

// Posts
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostNewComponent } from './post-new/post-new.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostService } from '../../core/services/post/post.service';
import { PostRoutingModule } from './post-routing.module';
import { LikeService } from '@app/core/services/like/like.service';
import { ViewService } from '@app/core/services/view/view.service';
import { FlnCommentComponent } from '@app/core/widget/fln-comment/fln-comment.component';
import { FlnLikeComponent } from '@app/core/widget/fln-like/fln-like.component';
import { PipesModule } from '@app/core/pipes/pipes.module';

import { CommentsComponent } from '@app/containers/comments/comments.component';
import { CommentDetailComponent } from '@app/containers/comments/comment-detail/comment-detail.component';
import { PostStateService } from './post-state.service';
import { FlnUploadTaskComponent } from '@app/core/widget/fln-upload-task/fln-upload-task.component';
import { PostModalComponent } from './post-modal/post-modal.component';
@NgModule({
  declarations: [
    PostDetailComponent,
    PostNewComponent,
    PostEditComponent,
    PostListComponent,
    CommentsComponent,
    FlnCommentComponent,
    FlnLikeComponent,
    CommentDetailComponent,
    FlnUploadTaskComponent,
    PostModalComponent
  ],
  entryComponents: [
    PostListComponent,
    PostDetailComponent
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
    PipesModule
  ],
  exports: [
    PostListComponent,
  ],
  providers: [NgbActiveModal, PostService, LikeService, ViewService, PostStateService],
  bootstrap: [PostListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostModule { }
