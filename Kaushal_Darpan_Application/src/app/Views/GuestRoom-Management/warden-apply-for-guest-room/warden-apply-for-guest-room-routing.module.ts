import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WardenApplyForGuestRoomComponent } from './warden-apply-for-guest-room.component';

const routes: Routes = [{ path: '', component: WardenApplyForGuestRoomComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WardenApplyForGuestRoomRoutingModule { }
