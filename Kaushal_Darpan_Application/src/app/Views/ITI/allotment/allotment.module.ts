import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllotmentRoutingModule } from './allotment-routing.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { AllotmentComponent } from './allotment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AllotmentComponent
  ],
  imports: [
    CommonModule,
    AllotmentRoutingModule, FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule, OTPModalModule,NgSelectModule
  ]
})
export class AllotmentModule { }
