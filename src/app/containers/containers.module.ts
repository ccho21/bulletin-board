import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { ResumeComponent } from './resume/resume.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ProjectsComponent } from './projects/projects.component';
import { AboutComponent } from './about/about.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule,
    ],
    declarations: [
        HomeComponent,
        ResumeComponent,
        ContactUsComponent,
        ProjectsComponent,
        AboutComponent,
    ],
    entryComponents: [HomeComponent, ResumeComponent],
    exports:[  ]
})
export class ContainersModule { }
