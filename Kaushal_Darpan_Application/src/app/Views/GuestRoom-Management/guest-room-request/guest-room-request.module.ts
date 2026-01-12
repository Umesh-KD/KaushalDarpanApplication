import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestRoomRequestComponent } from './guest-room-request.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { GuestRoomRequestRoutingModule } from './guest-room-request-routing.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    GuestRoomRequestComponent
  ],
  imports: [
    CommonModule, MaterialModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule,
    GuestRoomRequestRoutingModule,
    OTPModalModule
  ]
})
export class GuestRoomRequestModule { }
