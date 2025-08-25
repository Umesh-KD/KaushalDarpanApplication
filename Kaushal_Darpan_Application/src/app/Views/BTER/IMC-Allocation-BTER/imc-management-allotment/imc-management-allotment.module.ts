import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IMCManagementAllotmentRoutingModule } from './imc-management-allotment-routing.module';
import { IMCManagementAllotmentComponent } from './imc-management-allotment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    IMCManagementAllotmentComponent
  ],
  imports: [
    CommonModule,
    IMCManagementAllotmentRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class IMCManagementAllotmentModule { }
