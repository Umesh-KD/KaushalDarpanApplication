import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacementDataReportComponent } from './placement-data-report.component';

const routes: Routes = [{ path: '', component: PlacementDataReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementDataReportRoutingModule { }
