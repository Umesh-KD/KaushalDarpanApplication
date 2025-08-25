import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iti8ThSeatUtilizationStatusComponent } from './iti-8th-seat-utilization-status.component';

const routes: Routes = [{ path: '', component: Iti8ThSeatUtilizationStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iti8ThSeatUtilizationStatusRoutingModule { }
