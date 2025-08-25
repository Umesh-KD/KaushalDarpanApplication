import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomAvailabiltiesRoutingModule } from './room-availabilties-routing.module';
import { RoomAvailabiltiesComponent } from './room-availabilties.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RoomAvailabiltiesComponent
  ],
  imports: [
    CommonModule,
    RoomAvailabiltiesRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class RoomAvailabiltiesModule { }
