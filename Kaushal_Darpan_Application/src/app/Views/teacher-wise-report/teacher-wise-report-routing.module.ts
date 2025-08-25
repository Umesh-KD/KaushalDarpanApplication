import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherWiseReportComponent } from './teacher-wise-report.component';

const routes: Routes = [{ path: '', component: TeacherWiseReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherWiseReportRoutingModule { }
