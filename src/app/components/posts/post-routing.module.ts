import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { postRouterConfig } from './post.routes';

const postsRoutes: Routes = postRouterConfig;
@NgModule({
  imports: [
      RouterModule.forChild(postsRoutes)
    ],
  exports: [RouterModule]
})
export class PostRoutingModule { }
