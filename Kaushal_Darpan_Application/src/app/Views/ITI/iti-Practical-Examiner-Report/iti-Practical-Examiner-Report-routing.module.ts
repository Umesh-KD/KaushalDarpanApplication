import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itiPracticalExaminerReportComponent } from './iti-Practical-Examiner-Report.component';

const routes: Routes = [{ path: '', component: itiPracticalExaminerReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class itiPracticalExaminerReportRoutingModule { }
