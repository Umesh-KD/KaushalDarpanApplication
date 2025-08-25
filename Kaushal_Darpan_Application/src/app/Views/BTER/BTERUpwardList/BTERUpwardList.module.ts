import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BTERUpwardListRoutingModule } from './BTERUpwardList-routing.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { BTERUpwardListComponent } from './BTERUpwardList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    BTERUpwardListComponent
  ],
  imports: [
    CommonModule,
    BTERUpwardListRoutingModule, FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule, OTPModalModule
  ]
})
export class BTERUpwardListModule { }
