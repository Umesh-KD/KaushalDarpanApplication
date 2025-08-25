import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentEnrollmentApprovalRejectComponent } from './student-enrollment-approval-reject.component';

const routes: Routes = [{ path: '', component: StudentEnrollmentApprovalRejectComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentEnrollmentApprovalRejectRoutingModule { }
