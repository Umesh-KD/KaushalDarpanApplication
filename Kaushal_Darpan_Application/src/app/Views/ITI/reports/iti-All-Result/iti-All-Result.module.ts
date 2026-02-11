import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { itiAllResultRoutingModule } from './iti-All-Result-routing.module';
import { itiAllResultComponent } from './iti-All-Result.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from "../../../Shared/loader/loader.module";
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    itiAllResultComponent
  ],
  imports: [
    CommonModule,
    itiAllResultRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule, TableSearchFilterModule, OTPModalModule
  ]
})
export class itiAllResultModule { }
