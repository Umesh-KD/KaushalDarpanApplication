import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListSeatMetrixRoutingModule } from './list-seat-metrix-routing.module';
import { ListSeatMetrixComponent } from './list-seat-metrix.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from '../../../../material.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ListSeatMetrixComponent
  ],
  imports: [
    CommonModule,
    ListSeatMetrixRoutingModule,    
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule, OTPModalModule,
    NgMultiSelectDropDownModule.forRoot(), MaterialModule,
        NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent
  ]
})
export class ListSeatMetrixModule { }
