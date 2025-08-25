import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObserverReportComponent } from './observer-report.component';

const routes: Routes = [{ path: '', component: ObserverReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObserverReportRoutingModule { }
