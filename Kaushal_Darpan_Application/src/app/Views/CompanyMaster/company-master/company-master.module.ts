import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { CompanyMasterComponent } from './company-master.component';
import { CompanyMasterListRoutingModule } from './company-master.routing.module';

@NgModule({
  declarations: [
    CompanyMasterComponent
  ],
  imports: [
    CommonModule,
    CompanyMasterListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class CompanyMasterListModule { }
