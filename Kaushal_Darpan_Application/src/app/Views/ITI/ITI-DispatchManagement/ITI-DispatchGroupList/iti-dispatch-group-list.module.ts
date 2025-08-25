import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIDispatchGroupListRoutingModule } from './iti-dispatch-group-list-routing.module';
import { ITIDispatchGroupListComponent } from './iti-dispatch-group-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIDispatchGroupListComponent
  ],
  imports: [
    CommonModule,
    ITIDispatchGroupListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    MaterialModule, NgSelectModule, OTPModalModule

  ]
})
export class ITIDispatchGroupListModule { }
