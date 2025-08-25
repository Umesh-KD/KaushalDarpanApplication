import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterAllotmentReportingComponent } from './bter-allotment-reporting.component';

const routes: Routes = [{ path: '', component: BterAllotmentReportingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterAllotmentReportingRoutingModule { }
