import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabulationReportComponent } from './tabulation-report.component';

const routes: Routes = [{ path: '', component: TabulationReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabulationReportRoutingModule { }
