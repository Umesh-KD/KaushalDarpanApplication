import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentReportDownloadComponent } from './allotment-report-download.component';

const routes: Routes = [{ path: '', component: AllotmentReportDownloadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentReportDownloadRoutingModule { }
