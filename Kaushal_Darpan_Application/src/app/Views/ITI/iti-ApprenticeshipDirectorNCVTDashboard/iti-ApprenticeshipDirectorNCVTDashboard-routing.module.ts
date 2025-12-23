import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprenticeshipDirectorNCVTDashboardComponent } from './iti-ApprenticeshipDirectorNCVTDashboard.component';

const routes: Routes = [{ path: '', component: ApprenticeshipDirectorNCVTDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprenticeshipDirectorNCVTDashboardRoutingModule { }
