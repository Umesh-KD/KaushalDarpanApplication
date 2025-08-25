import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestRoomFacilitiesRoutingModule } from './GuestRoomFacilities-routing.module';
import { GuestRoomFacilitiesComponent } from './GuestRoomFacilities.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    GuestRoomFacilitiesComponent
  ],
  imports: [
    CommonModule,
    GuestRoomFacilitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class GuestRoomFacilitiesModule { }






