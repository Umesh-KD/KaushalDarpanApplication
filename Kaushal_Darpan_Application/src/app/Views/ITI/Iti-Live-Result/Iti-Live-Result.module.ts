import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiLiveResultRoutingModule } from './Iti-Live-Result-routing.module';
import { ItiLiveResultComponent } from './Iti-Live-Result.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItiLiveResultComponent
  ],
  imports: [
    CommonModule,
    ItiLiveResultRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ItiLiveResultModule { }
