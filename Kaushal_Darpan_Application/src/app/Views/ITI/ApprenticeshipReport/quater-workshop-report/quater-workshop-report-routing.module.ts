import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuaterWorkshopReportComponent } from './quater-workshop-report.component';

const routes: Routes = [{ path: '', component: QuaterWorkshopReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuaterWorkshopReportRoutingModule { }
