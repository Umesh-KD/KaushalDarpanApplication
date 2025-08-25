import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStaffInitialDetailsComponent } from './add-staff-initial-details.component';

const routes: Routes = [{ path: '', component: AddStaffInitialDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddStaffInitialDetailsRoutingModule { }
