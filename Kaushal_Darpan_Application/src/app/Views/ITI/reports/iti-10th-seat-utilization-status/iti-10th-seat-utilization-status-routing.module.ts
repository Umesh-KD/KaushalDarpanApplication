import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iti10ThSeatUtilizationStatusComponent } from './iti-10th-seat-utilization-status.component';

const routes: Routes = [{ path: '', component: Iti10ThSeatUtilizationStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iti10ThSeatUtilizationStatusRoutingModule { }
