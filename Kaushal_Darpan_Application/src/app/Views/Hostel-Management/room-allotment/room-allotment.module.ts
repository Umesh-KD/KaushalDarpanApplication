import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomAllotmentRoutingModule } from './room-allotment-routing.module';
import { RoomAllotmentComponent } from './room-allotment.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RoomAllotmentComponent
  ],
  imports: [
    CommonModule,
    RoomAllotmentRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class RoomAllotmentModule { }
