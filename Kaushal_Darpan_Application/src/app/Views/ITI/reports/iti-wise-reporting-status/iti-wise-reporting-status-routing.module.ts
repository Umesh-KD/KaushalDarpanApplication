import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingStatusComponent } from './iti-wise-reporting-status.component';

const routes: Routes = [{ path: '', component: ReportingStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingStatusRoutingModule { }
