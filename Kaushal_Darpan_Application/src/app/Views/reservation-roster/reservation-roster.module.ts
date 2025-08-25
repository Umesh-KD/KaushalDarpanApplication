import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservationRosterRoutingModule } from './reservation-roster-routing.module';
import { ReservationRosterComponent } from './reservation-roster.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ReservationRosterComponent
  ],
  imports: [
    CommonModule,
    ReservationRosterRoutingModule,
     FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ReservationRosterModule { }
