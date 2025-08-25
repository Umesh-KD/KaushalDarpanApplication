import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterTradeStudentReportComponent } from './center-trade-student-report.component';

const routes: Routes = [{ path: '', component: CenterTradeStudentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterTradeStudentReportRoutingModule { }
