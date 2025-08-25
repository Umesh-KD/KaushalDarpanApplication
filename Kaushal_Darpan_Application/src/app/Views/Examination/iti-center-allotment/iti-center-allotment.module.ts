import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCenterAllotmentRoutingModule } from './iti-center-allotment-routing.module';
import { ItiCenterAllotmentComponent } from './iti-center-allotment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    ItiCenterAllotmentComponent
  ],
  imports: [
    CommonModule,
    ItiCenterAllotmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    TableSearchFilterModule
  ]
})
export class ItiCenterAllotmentModule { }
