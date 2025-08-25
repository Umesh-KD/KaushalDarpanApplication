import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchGroupListRoutingModule } from './dispatch-group-list-routing.module';
import { DispatchGroupListComponent } from './dispatch-group-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    DispatchGroupListComponent
  ],
  imports: [
    CommonModule,
    DispatchGroupListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    MaterialModule, NgSelectModule, OTPModalModule
  ]
})
export class DispatchGroupListModule { }
