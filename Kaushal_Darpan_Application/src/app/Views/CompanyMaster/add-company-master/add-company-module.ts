import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { CompanyMasterRoutingModule } from './add-company-master.routing.module';
import { AddCompanyMasterComponent } from './add-company-master.component';

@NgModule({
  declarations: [
    AddCompanyMasterComponent
  ],
  imports: [
    CommonModule,
    CompanyMasterRoutingModule
    ,FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class CompanyMasterModule { }
