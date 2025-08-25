import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostelRoomDetailsComponent } from './hostel-room-details.component';

const routes: Routes = [{ path: '', component: HostelRoomDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostelRoomDetailsRoutingModule { }
