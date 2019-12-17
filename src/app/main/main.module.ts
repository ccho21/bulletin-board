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
import { AboutComponent } from "../containers/about/about.component";
import { ContactUsComponent } from "../containers/contact-us/contact-us.component";
import { ProjectsComponent } from "../containers/projects/projects.component";
import { MainComponent } from "./main.component";
import { ResumeComponent } from '../containers/resume/resume.component';

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
    MainRoutingModule
  ],
  entryComponents: [MainComponent],
  providers: [NgbActiveModal],
  bootstrap: [MainComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule {}
