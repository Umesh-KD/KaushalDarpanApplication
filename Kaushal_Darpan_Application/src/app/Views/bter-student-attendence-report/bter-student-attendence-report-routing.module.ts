import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterStudentAttendenceReportComponent } from './bter-student-attendence-report.component';

const routes: Routes = [{ path: '', component: BterStudentAttendenceReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterStudentAttendenceReportRoutingModule { }
