import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostwiseOfficeVacancyReportComponent } from './postwise-office-vacancy-report.component';

const routes: Routes = [{ path: '', component: PostwiseOfficeVacancyReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostwiseOfficeVacancyReportRoutingModule { }
