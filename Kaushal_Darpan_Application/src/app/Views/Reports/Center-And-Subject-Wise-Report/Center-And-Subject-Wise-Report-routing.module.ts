import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterAndSubjectWiseReportComponent } from './Center-And-Subject-Wise-Report.component';

const routes: Routes = [{ path: '', component: CenterAndSubjectWiseReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterAndSubjectWiseReportRoutingModule { }
