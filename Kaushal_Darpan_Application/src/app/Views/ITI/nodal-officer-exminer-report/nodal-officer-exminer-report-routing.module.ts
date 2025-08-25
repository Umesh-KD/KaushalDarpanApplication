import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodalOfficerExminerReportComponent } from './nodal-officer-exminer-report.component';

const routes: Routes = [{ path: '', component: NodalOfficerExminerReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodalOfficerExminerReportRoutingModule { }
