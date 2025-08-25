import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { cbtcenterRoutingModule } from './cbt-center-routing.module';
import { cbtcenterComponent } from './cbt-center.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from "../../Shared/loader/loader.module";
import { OTPModalModule } from '../../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    cbtcenterComponent
  ],
  imports: [
    CommonModule,
    cbtcenterRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule, TableSearchFilterModule, OTPModalModule
  ]
})
export class cbtcenterModule { }
