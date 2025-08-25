import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchGroupRevalListRoutingModule } from './dispatch-group-reval-list-routing.module';
import { DispatchGroupRevalListComponent } from './dispatch-group-reval-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    DispatchGroupRevalListComponent
  ],
  imports: [
    CommonModule,
    DispatchGroupRevalListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    MaterialModule, NgSelectModule, OTPModalModule
  ]
})
export class DispatchGroupRevalListModule { }
