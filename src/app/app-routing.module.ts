import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { rootRouterConfig } from "./app.routes";
import { ForumRoutingModule } from "./containers/forum/forum-routing.module";

const routes: Routes = rootRouterConfig;
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: true }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
