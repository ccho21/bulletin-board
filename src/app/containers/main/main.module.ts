// angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { AboutComponent } from '@app/components/about/about.component';
import { ContactUsComponent } from '@app/components/contact-us/contact-us.component';
import { ProjectsComponent } from '@app/components/projects/projects.component';
import { MainComponent } from './main.component';
import { ResumeComponent } from '@app/components/resume/resume.component';
import { DanielInfoComponent } from '@app/components/about/daniel-info/daniel-info.component';
import { CharlesInfoComponent } from '@app/components/about/charles-info/charles-info.component';
import { CardComponent } from '@app/components/about/daniel-info/card/card.component';

// Main
import { MainRoutingModule } from './main-routing.module';
import { PostModule } from '@app/components/posts/post.module';
import { PostStateService } from '@app/components/posts/post-state.service';

@NgModule({
  declarations: [
    MainComponent,
    AboutComponent,
    ContactUsComponent,
    ProjectsComponent,
    ResumeComponent,
    DanielInfoComponent,
    CharlesInfoComponent,
    CardComponent
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
    MainRoutingModule,
    PostModule,

  ],
  providers: [
    PostStateService
  ]
})
export class MainModule {}
