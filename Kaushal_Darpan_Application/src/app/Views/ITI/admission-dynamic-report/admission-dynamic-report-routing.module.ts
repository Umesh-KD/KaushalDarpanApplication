import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionDynamicReportComponent } from './admission-dynamic-report.component';

const routes: Routes = [{ path: '', component: AdmissionDynamicReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmissionDynamicReportRoutingModule { }
