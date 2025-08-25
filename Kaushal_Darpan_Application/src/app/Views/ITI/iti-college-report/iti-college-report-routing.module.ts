import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCollegeReportComponent } from './iti-college-report.component';

const routes: Routes = [{ path: '', component: ItiCollegeReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCollegeReportRoutingModule { }
