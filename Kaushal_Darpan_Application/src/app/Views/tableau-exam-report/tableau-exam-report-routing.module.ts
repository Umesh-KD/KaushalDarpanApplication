import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableauExamReportComponent } from './tableau-exam-report.component';

const routes: Routes = [{ path: '', component: TableauExamReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableauExamReportRoutingModule { }
