import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterAttendenceRoomComponent } from './bter-attendence-room.component';

const routes: Routes = [{ path: '', component: BterAttendenceRoomComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterAttendenceRoomRoutingModule { }
