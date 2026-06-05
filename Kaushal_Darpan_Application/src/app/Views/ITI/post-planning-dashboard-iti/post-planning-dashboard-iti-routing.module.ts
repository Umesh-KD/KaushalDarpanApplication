import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostPlanningDashboardITIComponent } from './post-planning-dashboard-iti.component';

const routes: Routes = [{ path: '', component: PostPlanningDashboardITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostPlanningDashboardITIRoutingModule { }
