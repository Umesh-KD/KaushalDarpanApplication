import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprenticeshipRegistrationReport } from './apprenticeship-registration-report.component';

const routes: Routes = [{ path: '', component: ApprenticeshipRegistrationReport }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprenticeshipRegistrationReportRoutingModule { }
