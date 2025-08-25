import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentEnrollmentReportComponent } from './student-enrollment-report.component';

const routes: Routes = [{ path: '', component: StudentEnrollmentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentEnrollmentReportRouting { }   
