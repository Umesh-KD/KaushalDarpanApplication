import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacantSeatRoutingModule } from './vacant-seat-routing.module';
import { VacantSeatComponent } from './vacant-seat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    VacantSeatComponent
  ],
  imports: [
    CommonModule,
    VacantSeatRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class VacantSeatModule { }
