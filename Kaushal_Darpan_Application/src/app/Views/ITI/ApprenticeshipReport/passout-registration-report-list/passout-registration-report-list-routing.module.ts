import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassoutRegistrationReportListComponent } from './passout-registration-report-list.component';

const routes: Routes = [{ path: '', component: PassoutRegistrationReportListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassoutRegistrationReportListRoutingModule { }
