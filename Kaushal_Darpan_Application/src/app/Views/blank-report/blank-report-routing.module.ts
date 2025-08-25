import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankReportComponent } from './blank-report.component';

const routes: Routes = [{ path: '', component: BlankReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlankReportRoutingModule { }
