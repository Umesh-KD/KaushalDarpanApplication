import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectWiseReportComponent } from './subject-wise-report.component';

const routes: Routes = [{ path: '', component: SubjectWiseReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectWiseReportRoutingModule { }
