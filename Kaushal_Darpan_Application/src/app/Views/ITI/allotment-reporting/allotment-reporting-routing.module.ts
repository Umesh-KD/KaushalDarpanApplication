import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentReportingComponent } from './allotment-reporting.component';

const routes: Routes = [{ path: '', component: AllotmentReportingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentReportingRoutingModule { }
