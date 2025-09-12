import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IIPManageAdminReportComponent } from './iip-manage-admin-report.component';

const routes: Routes = [{ path: '', component: IIPManageAdminReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IIPManageAdminReportRoutingModule { }
