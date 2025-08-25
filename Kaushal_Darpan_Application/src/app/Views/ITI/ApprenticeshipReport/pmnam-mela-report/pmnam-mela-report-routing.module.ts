import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PmnamMelaReportComponent } from './pmnam-mela-report.component';

const routes: Routes = [{ path: '', component: PmnamMelaReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PMNAMMelaReportBeforeAfterRoutingModule { }
