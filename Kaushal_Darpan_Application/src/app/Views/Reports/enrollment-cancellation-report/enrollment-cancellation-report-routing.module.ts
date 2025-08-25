import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnrollmentCancellationReportComponent } from './enrollment-cancellation-report.component';

const routes: Routes = [{ path: '', component: EnrollmentCancellationReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentCancellationReportRoutingModule { }
