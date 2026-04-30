import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddTransferRequestRoutingModule } from './AddTransferRequest-routing.module';
import { AddTransferRequestComponent } from './AddTransferRequest.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    AddTransferRequestComponent
  ],
  imports: [
    CommonModule,
    AddTransferRequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(), 
    OTPModalModule
  ]
})
export class AddTransferRequestModule { }
