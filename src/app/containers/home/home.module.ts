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
import { AboutComponent } from "../about/about.component";
import { ContactUsComponent } from "../contact-us/contact-us.component";
import { ProjectsComponent } from "../projects/projects.component";
import { HomeComponent } from "./home.component";
import { ResumeComponent } from '../resume/resume.component';
// Posts

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    ContactUsComponent,
    ProjectsComponent,
    ResumeComponent
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
    MatDialogModule
  ],
  entryComponents: [HomeComponent],
  providers: [NgbActiveModal],
  bootstrap: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule {}
