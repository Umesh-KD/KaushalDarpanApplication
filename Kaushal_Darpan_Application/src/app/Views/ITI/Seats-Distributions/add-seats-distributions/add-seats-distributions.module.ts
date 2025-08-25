import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSeatsDistributionsRoutingModule } from './add-seats-distributions-routing.module';
import { AddSeatsDistributionsComponent } from './add-seats-distributions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    AddSeatsDistributionsComponent
  ],
  imports: [
    CommonModule,
    AddSeatsDistributionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class AddSeatsDistributionsModule { }
