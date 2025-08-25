import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { AddItiCompanyMasterComponent } from './additi-company-master.component';
import { ItiCompanyMasterRoutingModule } from './additi-company-master.routing.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    AddItiCompanyMasterComponent
  ],
  imports: [
    CommonModule,
    ItiCompanyMasterRoutingModule
    ,FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ItiCompanyMasterModule { }
