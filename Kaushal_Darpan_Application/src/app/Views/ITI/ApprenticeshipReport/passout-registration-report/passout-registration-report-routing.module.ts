import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassoutRegistrationReportComponent } from './passout-registration-report.component';

const routes: Routes = [{ path: '', component: PassoutRegistrationReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassoutRegistrationReportRoutingModule { }
