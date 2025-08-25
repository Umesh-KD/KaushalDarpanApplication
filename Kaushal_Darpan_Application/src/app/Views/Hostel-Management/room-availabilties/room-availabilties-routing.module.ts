import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomAvailabiltiesComponent } from './room-availabilties.component';

const routes: Routes = [{ path: '', component: RoomAvailabiltiesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomAvailabiltiesRoutingModule { }
