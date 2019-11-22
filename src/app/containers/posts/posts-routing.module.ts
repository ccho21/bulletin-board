import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { postsRouterConfig } from './posts.routes'; 

const postsRoutes: Routes = postsRouterConfig;
@NgModule({
  imports: [
      RouterModule.forRoot(postsRoutes)
    ],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
