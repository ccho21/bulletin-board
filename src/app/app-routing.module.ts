import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { EditUserResolver } from './users/edit-user/edit-user.resolver';

import { rootRouterConfig } from './app.routes'; 
// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'home', component: HomeComponent },
//   { path: 'new-user', component: NewUserComponent },
//   { path: 'details/:id', component: EditUserComponent, resolve:{data : EditUserResolver} }
// ];

const routes: Routes = rootRouterConfig;
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
