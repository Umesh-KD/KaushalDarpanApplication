import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentPaperReportComponent } from './student-paper-report.component';

const routes: Routes = [{ path: '', component: StudentPaperReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentPaperReportRoutingModule { }
