import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprenticeshipRegistrationReportList } from './apprenticeship-registration-report-list.component';

const routes: Routes = [{ path: '', component: ApprenticeshipRegistrationReportList }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprenticeshipRegistrationReportListRoutingModule { }
