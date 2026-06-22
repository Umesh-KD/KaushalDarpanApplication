import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherHigherTechnicalEducationReportComponent } from './teacher-higher-technical-education-report.component';

const routes: Routes = [{ path: '', component: TeacherHigherTechnicalEducationReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherHigherTechnicalEducationReportRoutingModule { }
