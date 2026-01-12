import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddGuestApplyForGuestRoomComponent } from './AddGuestApplyForGuestRoom.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';
import { Routes, RouterModule } from '@angular/router';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { AddGuestApplyForGuestRoomRoutingModule } from './AddGuestApplyForGuestRoom-routing.module';

@NgModule({
  declarations: [
    AddGuestApplyForGuestRoomComponent
  ],
  imports: [
    CommonModule, MaterialModule, 
    FormsModule, ReactiveFormsModule,  LoaderModule, TableSearchFilterModule,
    AddGuestApplyForGuestRoomRoutingModule,
    OTPModalModule
  ]
})
export class AddGuestApplyForGuestRoomModule { }
