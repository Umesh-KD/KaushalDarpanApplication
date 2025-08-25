import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITICenterObserverReportComponent } from './iti-center-observer-report.component';

const routes: Routes = [{ path: '', component: ITICenterObserverReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITICenterObserverReportRoutingModule { }
