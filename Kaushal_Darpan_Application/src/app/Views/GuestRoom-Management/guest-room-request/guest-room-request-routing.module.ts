import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestRoomRequestComponent } from './guest-room-request.component';

const routes: Routes = [{ path: '', component: GuestRoomRequestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoomRequestRoutingModule { }
