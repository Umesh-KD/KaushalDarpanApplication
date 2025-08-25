import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentStatusITIComponent } from './allotment-status-iti.component';

const routes: Routes = [{ path: '', component: AllotmentStatusITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentStatusITIRoutingModule { }
