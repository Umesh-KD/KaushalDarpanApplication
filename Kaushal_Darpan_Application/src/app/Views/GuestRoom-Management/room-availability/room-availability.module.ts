import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { RoomAvailabilityComponent } from './room-availability.component';
import { RoomAvailabilityRoutingModule } from './room-availability-routing.module';


@NgModule({
  declarations: [
    RoomAvailabilityComponent
  ],
  imports: [
    CommonModule,
    RoomAvailabilityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class RoomAvailabilityModule { }






