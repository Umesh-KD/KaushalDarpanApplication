import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EMStaffNewProcessTrainingComponent } from './EM-Staff-New-Process-Training.component';

const routes: Routes = [{ path: '', component: EMStaffNewProcessTrainingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EMStaffNewProcessTrainingRoutingModule { }
