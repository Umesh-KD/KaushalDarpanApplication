import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomSeatMasterRoutingModule } from './room-seat-master-routing.module';
import { RoomSeatMasterComponent } from './room-seat-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    RoomSeatMasterComponent
  ],
  imports: [
    CommonModule,
    RoomSeatMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class RoomSeatMasterModule { }

