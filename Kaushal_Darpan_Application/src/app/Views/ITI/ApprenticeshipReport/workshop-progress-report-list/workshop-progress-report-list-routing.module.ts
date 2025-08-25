import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkshopProgressReportListComponent } from './workshop-progress-report-list.component';

const routes: Routes = [{ path: '', component: WorkshopProgressReportListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopProgressReportListRoutingModule { }
