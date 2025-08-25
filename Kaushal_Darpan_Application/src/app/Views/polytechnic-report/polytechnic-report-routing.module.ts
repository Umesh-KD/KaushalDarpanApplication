import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolytechnicReportComponent } from './polytechnic-report.component';

const routes: Routes = [{ path: '', component: PolytechnicReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolytechnicReportRoutingModule { }
