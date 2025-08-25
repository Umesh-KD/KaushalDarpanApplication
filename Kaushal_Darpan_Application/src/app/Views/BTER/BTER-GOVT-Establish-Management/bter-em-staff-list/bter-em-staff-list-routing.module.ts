import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BTEREMStaffListComponent } from './bter-em-staff-list.component';

const routes: Routes = [{ path: '', component: BTEREMStaffListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BTEREMStaffListRoutingModule { }
