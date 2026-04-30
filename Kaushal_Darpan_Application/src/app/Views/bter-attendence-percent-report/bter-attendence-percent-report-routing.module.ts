import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterAttendencePercentReportComponent } from './bter-attendence-percent-report.component';

const routes: Routes = [{ path: '', component: BterAttendencePercentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterAttendencePercentReportRoutingModule { }
