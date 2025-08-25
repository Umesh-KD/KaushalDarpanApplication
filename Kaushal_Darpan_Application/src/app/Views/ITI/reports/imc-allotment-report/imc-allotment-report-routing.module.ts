import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IMCAllotmentReportComponent } from './imc-allotment-report.component';

const routes: Routes = [{ path: '', component: IMCAllotmentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IMCAllotmentReportRoutingModule { }
