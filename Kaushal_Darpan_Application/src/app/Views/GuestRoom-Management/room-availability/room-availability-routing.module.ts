import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomAvailabilityComponent } from './room-availability.component';

const routes: Routes = [{ path: '', component: RoomAvailabilityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomAvailabilityRoutingModule { }
