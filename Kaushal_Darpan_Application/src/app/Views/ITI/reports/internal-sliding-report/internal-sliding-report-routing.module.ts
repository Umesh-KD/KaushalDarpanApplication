import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalSlidingReportComponent } from './internal-sliding-report.component';

const routes: Routes = [{ path: '', component: InternalSlidingReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalSlidingReportRoutingModule { }
