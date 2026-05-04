import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterAttendenceRoomRoutingModule } from './bter-attendence-room-routing.module';
import { BterAttendenceRoomComponent } from './bter-attendence-room.component';


@NgModule({
  declarations: [
    BterAttendenceRoomComponent
  ],
  imports: [
    CommonModule,
    BterAttendenceRoomRoutingModule
  ]
})
export class BterAttendenceRoomModule { }
