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

//Forum
import { ForumRoutingModule } from "./forum-routing.module";
import { ForumService } from "./shared/forum.service";
import { ForumComponent } from "./forum.component";
import { PostsComponent } from "./posts/posts.component";
import { PostComponent } from "./post/post.component";
import { CreatePostComponent } from "./create-post/create-post.component";
import { DeletePostComponent } from "./delete-post/delete-post.component";
import { EditPostComponent } from "./edit-post/edit-post.component";

@NgModule({
  declarations: [
    PostsComponent,
    PostComponent,
    CreatePostComponent,
    DeletePostComponent,
    EditPostComponent,
    ForumComponent
  ],
  entryComponents: [
    PostsComponent,
    PostComponent,
    CreatePostComponent,
    DeletePostComponent,
    EditPostComponent,
    ForumComponent
  ],
  imports: [
    ForumRoutingModule,
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
    MatDialogModule
  ],
  providers: [NgbActiveModal, ForumService],
  bootstrap: [ForumComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForumModule {}
