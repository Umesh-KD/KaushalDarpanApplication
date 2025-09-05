import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIIIPAdminReportComponent } from './iip-admin-report.component';

const routes: Routes = [{ path: '', component: ITIIIPAdminReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIIIPAdminReportRoutingModule { }
