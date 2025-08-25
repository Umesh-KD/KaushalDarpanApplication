import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoomDashboardRoutingModule } from './guestroom-dashboard-routing.module';
import { GuestRoomDashboardComponent } from './guestroom-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    GuestRoomDashboardComponent
  ],
  imports: [
    CommonModule,
    GuestRoomDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
  ],
  exports: [GuestRoomDashboardComponent]
})
export class GuestRoomDashboardModule { }
