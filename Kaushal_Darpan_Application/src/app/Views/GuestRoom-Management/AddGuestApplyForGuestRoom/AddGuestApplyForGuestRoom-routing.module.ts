import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGuestApplyForGuestRoomComponent } from './AddGuestApplyForGuestRoom.component';

const routes: Routes = [{ path: '', component: AddGuestApplyForGuestRoomComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddGuestApplyForGuestRoomRoutingModule { }
