import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PMNAMMelaReportBeforeAfterComponent } from './pmnam-mela-report-before-after.component';

const routes: Routes = [{ path: '', component: PMNAMMelaReportBeforeAfterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PMNAMMelaReportBeforeAfterRoutingModule { }
