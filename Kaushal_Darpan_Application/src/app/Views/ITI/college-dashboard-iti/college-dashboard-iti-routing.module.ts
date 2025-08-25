import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeDashboardITIComponent } from './college-dashboard-iti.component';

const routes: Routes = [{ path: '', component: CollegeDashboardITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeDashboardITIRoutingModule { }


