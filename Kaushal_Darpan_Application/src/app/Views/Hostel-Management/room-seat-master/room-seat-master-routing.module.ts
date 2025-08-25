import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomSeatMasterComponent } from './room-seat-master.component';

const routes: Routes = [{ path: '', component: RoomSeatMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomSeatMasterRoutingModule { }
