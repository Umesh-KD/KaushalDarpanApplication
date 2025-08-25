import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyDispatchListComponentRoutingModule } from './company-dispatch-list-routing.module';
import { CompanyDispatchListComponent } from './company-dispatch-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    CompanyDispatchListComponent
  ],
  imports: [
    CommonModule,
    CompanyDispatchListComponentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    MaterialModule, NgSelectModule, OTPModalModule
  ]
})
export class CompanyDispatchListModule { }
