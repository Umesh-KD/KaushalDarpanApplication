import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddIipCompanyMasterRoutingModule } from './add-iip-company-master-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AddIipCompanyMasterComponent } from './add-iip-company-master.component';


@NgModule({
  declarations: [
    AddIipCompanyMasterComponent
  ],
  imports: [
    CommonModule,
    AddIipCompanyMasterRoutingModule
    , FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class AddIipCompanyMasterModule { }
