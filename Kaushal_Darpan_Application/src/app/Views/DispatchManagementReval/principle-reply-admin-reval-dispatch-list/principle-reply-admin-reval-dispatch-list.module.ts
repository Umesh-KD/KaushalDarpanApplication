import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipleReplyAdminRevalDispatchListRoutingModule } from './principle-reply-admin-reval-dispatch-list-routing.module';
import { PrincipleReplyAdminRevalDispatchListComponent } from './principle-reply-admin-reval-dispatch-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    PrincipleReplyAdminRevalDispatchListComponent
  ],
  imports: [
    CommonModule,
    PrincipleReplyAdminRevalDispatchListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    MaterialModule, NgSelectModule, OTPModalModule
  ]
})
export class PrincipleReplyAdminRevalDispatchListModule { }
