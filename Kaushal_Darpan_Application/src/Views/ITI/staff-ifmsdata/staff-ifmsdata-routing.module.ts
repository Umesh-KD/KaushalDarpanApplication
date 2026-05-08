import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffIFMSDataComponent } from './staff-ifmsdata.component';

const routes: Routes = [{ path: '', component: StaffIFMSDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffIFMSDataRoutingModule { }
