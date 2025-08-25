import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentSeatWithdrawReportComponent } from './student-seat-withdraw-report.component';

const routes: Routes = [{ path: '', component: StudentSeatWithdrawReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentSeatWithdrawReportRoutingModule { }
