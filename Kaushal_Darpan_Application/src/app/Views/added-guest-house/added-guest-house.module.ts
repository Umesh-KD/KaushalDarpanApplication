import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddedGuestHouseRoutingModule } from './added-guest-house-routing.module';
import { AddedGuestHouseComponent } from './added-guest-house.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddedGuestHouseComponent
  ],
  imports: [
    CommonModule,
    AddedGuestHouseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class AddedGuestHouseModule { }
