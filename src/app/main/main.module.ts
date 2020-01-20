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
import { AboutComponent } from "../components/about/about.component";
import { ContactUsComponent } from "../components/contact-us/contact-us.component";
import { ProjectsComponent } from "../components/projects/projects.component";
import { MainComponent } from "./main.component";
import { ResumeComponent } from '../components/resume/resume.component';

import { PostModule} from '../containers/posts/post.module';

// Main
import { MainRoutingModule } from './main-routing.module';
 
@NgModule({
  declarations: [
    MainComponent,
    AboutComponent,
    ContactUsComponent,
    ProjectsComponent,
    ResumeComponent,
  ],
  imports: [
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
    MainRoutingModule,
    PostModule
  ],
  entryComponents: [MainComponent],
  exports: [MainComponent],
  providers: [NgbActiveModal],
  bootstrap: [MainComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule {}
