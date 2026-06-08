import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderCategoryRoutingModule } from './ordercategory-routing.module';
import { OrderCategoryComponent } from './ordercategory.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    OrderCategoryComponent
  ],
  imports: [
    CommonModule,
    OrderCategoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    OTPModalModule
  ]
})
export class OrderCategoryModule { }
