import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BterDynamicReportComponent } from './bter-dynamic-report.component';





const routes: Routes = [{ path: '', component: BterDynamicReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterDynamicReportRoutingModule { }
