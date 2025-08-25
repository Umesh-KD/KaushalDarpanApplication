import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIInspectionReportComponent } from './iti-inspection-report.component';

const routes: Routes = [{ path: '', component: ITIInspectionReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIInspectionReportRoutingModule { }
