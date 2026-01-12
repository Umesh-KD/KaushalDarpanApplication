import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { WardenApplyForGuestRoomComponent } from './warden-apply-for-guest-room.component';
import { WardenApplyForGuestRoomRoutingModule } from './warden-apply-for-guest-room-routing.module';

@NgModule({
  declarations: [
    WardenApplyForGuestRoomComponent
  ],
  imports: [
    CommonModule, MaterialModule, 
    FormsModule, ReactiveFormsModule,  LoaderModule, TableSearchFilterModule,
    WardenApplyForGuestRoomRoutingModule,
    OTPModalModule
  ]
})
export class WardenApplyForGuestRoomModule { }
