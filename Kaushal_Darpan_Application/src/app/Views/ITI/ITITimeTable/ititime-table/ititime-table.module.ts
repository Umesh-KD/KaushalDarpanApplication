import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITITimeTableRoutingModule } from './ititime-table-routing.module';
import { ITITimeTableComponent } from './ititime-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from "../../../Shared/loader/loader.module";
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    ITITimeTableComponent
  ],
  imports: [
    CommonModule,
    ITITimeTableRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule, TableSearchFilterModule, OTPModalModule
  ]
})
export class ITITimeTableModule { }
