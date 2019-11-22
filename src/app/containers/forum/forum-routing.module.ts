import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { forumRouterConfig } from './forum.routes'; 

const forumRoutes: Routes = forumRouterConfig;
@NgModule({
  imports: [
      RouterModule.forRoot(forumRoutes)
    ],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
