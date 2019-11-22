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
import { PostsService } from './shared/posts.service';
import { PostsRoutingModule } from './posts-routing.module';



@NgModule({
  declarations: [
    PostDetailComponent,
    PostNewComponent,
    PostEditComponent,
    PostListComponent,
  ],
  entryComponents: [
    PostListComponent
  ],
  imports: [
    PostsRoutingModule,
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
  providers: [NgbActiveModal, PostsService],
  bootstrap: [PostListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostsModule {}
