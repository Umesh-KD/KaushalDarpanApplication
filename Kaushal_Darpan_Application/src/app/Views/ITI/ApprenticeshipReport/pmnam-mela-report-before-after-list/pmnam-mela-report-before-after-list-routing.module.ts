import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PMNAMMelaReportBeforeAfterListComponent } from './pmnam-mela-report-before-after-list.component';

const routes: Routes = [{ path: '', component: PMNAMMelaReportBeforeAfterListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PMNAMMelaReportBeforeAfterListRoutingModule { }
