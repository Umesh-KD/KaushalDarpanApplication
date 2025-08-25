import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterEMAddStaffDetailsComponent } from './bter-em-add-staff-details.component';

const routes: Routes = [{ path: '', component: BterEMAddStaffDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterEMAddStaffDetailsRoutingModule { }
