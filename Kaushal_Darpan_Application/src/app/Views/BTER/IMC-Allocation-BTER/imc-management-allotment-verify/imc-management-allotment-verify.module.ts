import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IMCManagementAllotmentVerifyRoutingModule } from './imc-management-allotment-verify-routing.module';
import { IMCManagementAllotmentVerifyComponent } from './imc-management-allotment-verify.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    IMCManagementAllotmentVerifyComponent
  ],
  imports: [
    CommonModule,
    IMCManagementAllotmentVerifyRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class IMCManagementAllotmentVerifyModule { }
