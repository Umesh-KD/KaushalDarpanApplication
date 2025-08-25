import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutejanaadharReportComponent } from './institutejanaadhar-report.component';

const routes: Routes = [{ path: '', component: InstitutejanaadharReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutejanaadharReportRoutingModule { }
