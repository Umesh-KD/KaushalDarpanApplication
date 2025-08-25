import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodalOfficerExminerReportListComponent } from './nodal-officer-exminer-report-list.component';

const routes: Routes = [{ path: '', component: NodalOfficerExminerReportListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodalOfficerExminerReportListRoutingModule { }
