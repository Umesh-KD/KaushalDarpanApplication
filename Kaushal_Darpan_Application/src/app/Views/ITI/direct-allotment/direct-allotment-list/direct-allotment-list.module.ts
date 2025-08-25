import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { DirectAllotmentListComponent } from './direct-allotment-list.component';
import { DirectAllotmentListRoutingModule } from './direct-allotment-list-routing.module';

@NgModule({
  declarations: [
    DirectAllotmentListComponent
  ],
  imports: [
    CommonModule,
    DirectAllotmentListRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class DirectAllotmentListModule { }
