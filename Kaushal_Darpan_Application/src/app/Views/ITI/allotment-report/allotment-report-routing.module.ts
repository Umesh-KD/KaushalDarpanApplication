import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentReportComponent } from './allotment-report.component';

const routes: Routes = [{ path: '', component: AllotmentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentReportRoutingModule { }
