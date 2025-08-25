import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  GuestRoomSeatMasterComponent } from './guestroom-seat-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';

const routes: Routes = [{ path: '', component: GuestRoomSeatMasterComponent }];

@NgModule({
  declarations: [
     GuestRoomSeatMasterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class  GuestRoomSeatMasterModule { }

