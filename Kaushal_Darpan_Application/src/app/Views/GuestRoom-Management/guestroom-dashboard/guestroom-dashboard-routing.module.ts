import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestRoomDashboardComponent } from './guestroom-dashboard.component';

const routes: Routes = [{ path: '', component: GuestRoomDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoomDashboardRoutingModule { }
