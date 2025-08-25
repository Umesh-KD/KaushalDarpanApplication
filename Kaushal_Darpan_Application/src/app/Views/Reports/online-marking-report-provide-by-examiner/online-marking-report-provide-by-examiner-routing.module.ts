import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineMarkingReportProvideByExaminerComponent } from './online-marking-report-provide-by-examiner.component';

const routes: Routes = [{ path: '', component: OnlineMarkingReportProvideByExaminerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineMarkingReportProvideByExaminerRoutingModule { }
