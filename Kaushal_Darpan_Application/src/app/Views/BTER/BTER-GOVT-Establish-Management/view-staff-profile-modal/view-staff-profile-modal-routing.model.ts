import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewStaffProfileModalComponent } from './view-staff-profile-modal.component';

const routes: Routes = [{ path: '', component: ViewStaffProfileModalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewStaffProfileModalRoutingModule { }
