import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScaReportComponent } from './sca-report.component';

const routes: Routes = [{ path: '', component: ScaReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScaReportRoutingModule { }
