// angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Boostrap
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
import { PipesModule } from '@app/core/pipes/pipes.module';

import { CommentsComponent } from '@app/components/comments/comments.component';
import { CommentDetailComponent } from '@app/components/comments/comment-detail/comment-detail.component';
// import { PostStateService } from './post-state.service';
import { PostModalComponent } from './post-modal/post-modal.component';

import { WgtUploadTaskComponent } from '@app/core/widget/wgt-upload-task/wgt-upload-task.component';
import { WgtCommentComponent } from '@app/core/widget/wgt-comment/wgt-comment.component';
import { WgtLikeComponent } from '@app/core/widget/wgt-like/wgt-like.component';
import { WgtBookmarkComponent } from '@app/core/widget/wgt-bookmark/wgt-bookmark.component';
import { BookmarkService } from '@app/core/services/bookmark/bookmark.service';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@app/components/components.module';
@NgModule({
  declarations: [
    PostDetailComponent,
    PostNewComponent,
    PostEditComponent,
    PostListComponent,
    CommentsComponent,
    WgtCommentComponent,
    WgtLikeComponent,
    CommentDetailComponent,
    WgtUploadTaskComponent,
    PostModalComponent,
    WgtBookmarkComponent,
  ],
  entryComponents: [
    PostListComponent,
    PostDetailComponent,
    PostNewComponent,
    PostModalComponent
  ],
  imports: [
    PostRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
    PipesModule,
    InfiniteScrollModule,
    ComponentsModule
  ],
  exports: [
    PostListComponent,
  ],
  providers: [
    NgbActiveModal,
    PostService,
    LikeService,
    ViewService,
    // PostStateService,
    BookmarkService
  ],
  bootstrap: [PostListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostModule { }
