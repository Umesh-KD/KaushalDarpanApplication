import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllotmentRoutingModule } from './allotment-routing.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { AllotmentComponent } from './allotment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    AllotmentComponent
  ],
  imports: [
    CommonModule,
    AllotmentRoutingModule, FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule, OTPModalModule
  ]
})
export class AllotmentModule { }
