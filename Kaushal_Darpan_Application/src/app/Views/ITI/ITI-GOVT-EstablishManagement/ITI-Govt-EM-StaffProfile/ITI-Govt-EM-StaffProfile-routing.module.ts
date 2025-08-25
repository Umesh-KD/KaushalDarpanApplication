import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtEMStaffProfileComponent } from './ITI-Govt-EM-StaffProfile.component';

const routes: Routes = [{ path: '', component: ITIGovtEMStaffProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGovtEMStaffProfileRoutingModule { }
