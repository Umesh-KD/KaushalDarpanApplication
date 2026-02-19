import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIPlanningDashboardComponent } from './ITI-Planning-Dashboard.component';

const routes: Routes = [{ path: '', component: ITIPlanningDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIPlanningDashboardRoutingModule { }


