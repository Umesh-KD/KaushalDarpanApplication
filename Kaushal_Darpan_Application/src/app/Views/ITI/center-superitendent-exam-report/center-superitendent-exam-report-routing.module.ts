import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterSuperitendentExamReportComponent } from './center-superitendent-exam-report.component';

const routes: Routes = [{ path: '', component: CenterSuperitendentExamReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterSuperitendentExamReportRoutingModule { }
