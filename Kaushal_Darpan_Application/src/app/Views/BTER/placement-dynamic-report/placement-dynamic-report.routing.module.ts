import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlacementDynamicReportComponent } from './placement-dynamic-report.component';





const routes: Routes = [{ path: '', component: PlacementDynamicReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementDynamicReportRoutingModule { }
