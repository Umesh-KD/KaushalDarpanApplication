import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomAllotmentComponent } from './room-allotment.component';

const routes: Routes = [{ path: '', component: RoomAllotmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomAllotmentRoutingModule { }
