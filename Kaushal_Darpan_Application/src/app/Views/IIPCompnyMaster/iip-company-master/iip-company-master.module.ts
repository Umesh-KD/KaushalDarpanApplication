import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IipCompanyMasterRoutingModule } from './iip-company-master-routing.module';
import { IipCompanyMasterComponent } from './iip-company-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    IipCompanyMasterComponent
  ],
  imports: [
    CommonModule,
    IipCompanyMasterRoutingModule
    , FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class IipCompanyMasterModule { }
