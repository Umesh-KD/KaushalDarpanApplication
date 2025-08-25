import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssuetrackerDashboardComponent1 } from './issuetracker-dashboard.component';



const routes: Routes = [{ path: '', component: IssuetrackerDashboardComponent1 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssuetrackerDashboardRoutingModule { }
