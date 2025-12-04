import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIAdminStaffComponent } from './itiadmin-staff.component';

const routes: Routes = [{ path: '', component: ITIAdminStaffComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIAdminStaffRoutingModule { }
