import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkshopProgressReportComponent } from './workshop-progress-report.component';

const routes: Routes = [{ path: '', component: WorkshopProgressReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopProgressReportRoutingModule { }
