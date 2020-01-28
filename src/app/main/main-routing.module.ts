import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { mainRouterConfig } from './main.routes'; 

const mainRoutes: Routes = mainRouterConfig;
@NgModule({
  imports: [
      RouterModule.forChild(mainRoutes)
    ],
  exports: [RouterModule]
})
export class MainRoutingModule { }
