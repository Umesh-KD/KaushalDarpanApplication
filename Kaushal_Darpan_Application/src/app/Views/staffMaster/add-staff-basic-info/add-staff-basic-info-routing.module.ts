import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStaffBasicInfoComponent } from './add-staff-basic-info.component';

const routes: Routes = [{ path: '', component: AddStaffBasicInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddStaffBasicInfoRoutingModule { }
