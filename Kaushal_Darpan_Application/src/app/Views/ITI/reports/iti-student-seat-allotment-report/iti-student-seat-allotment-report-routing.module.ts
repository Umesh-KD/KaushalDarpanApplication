import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiStudentSeatAllotmentReportComponent } from './iti-student-seat-allotment-report.component';

const routes: Routes = [{ path: '', component: ItiStudentSeatAllotmentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiStudentSeatAllotmentReportRoutingModule { }
