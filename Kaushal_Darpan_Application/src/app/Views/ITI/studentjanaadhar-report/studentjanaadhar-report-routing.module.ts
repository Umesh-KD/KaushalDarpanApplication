import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentjanaadharReportComponent } from './studentjanaadhar-report.component';

const routes: Routes = [{ path: '', component: StudentjanaadharReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentjanaadharReportRoutingModule { }
