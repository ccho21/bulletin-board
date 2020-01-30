import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { userRouterConfig } from './user.routes';

const userRoutes: Routes = userRouterConfig;
@NgModule({
  imports: [
      RouterModule.forChild(userRoutes)
    ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
