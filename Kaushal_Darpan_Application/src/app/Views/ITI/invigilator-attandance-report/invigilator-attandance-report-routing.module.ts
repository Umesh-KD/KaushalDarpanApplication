import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvigilatorAttandanceReportComponent } from './invigilator-attandance-report.component';

const routes: Routes = [{ path: '', component: InvigilatorAttandanceReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvigilatorAttandanceReportRoutingModule { }
