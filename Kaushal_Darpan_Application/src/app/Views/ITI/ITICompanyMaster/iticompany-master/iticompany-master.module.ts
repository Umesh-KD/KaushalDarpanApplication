import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItiCompanyMasterComponent } from './iticompany-master.component';
import { ItiCompanyMasterListRoutingModule } from './iticompany-master.routing.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    ItiCompanyMasterComponent
  ],
  imports: [
    CommonModule,
    ItiCompanyMasterListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ItiCompanyMasterListModule { }
