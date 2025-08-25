import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CopyCheckerDashboardComponent } from "./copy-checker-dashboard.component";

const routes: Routes = [{ path: '', component: CopyCheckerDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyCheckerDashboardRoutingModule { }
