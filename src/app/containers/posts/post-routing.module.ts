import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { postRouterConfig } from './post.routes';

const postsRoutes: Routes = postRouterConfig;
@NgModule({
  imports: [
      RouterModule.forRoot(postsRoutes)
    ],
  exports: [RouterModule]
})
export class PostRoutingModule { }
