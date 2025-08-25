import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternalSlidingRoutingModule } from './internal-sliding-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { InternalSlidingComponent } from './internal-sliding.component';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    InternalSlidingComponent
  ],
  imports: [
    CommonModule,
    InternalSlidingRoutingModule, FormsModule,
    ReactiveFormsModule, LoaderModule, TableSearchFilterModule, OTPModalModule
  ]
})
export class InternalSlidingModule { }
