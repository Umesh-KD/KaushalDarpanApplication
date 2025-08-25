import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterSuperintendentStudentReportComponent } from './CenterSuperintendentStudentReport.component';

const routes: Routes = [{ path: '', component: CenterSuperintendentStudentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterSuperintendentStudentReportRoutingModule { }
