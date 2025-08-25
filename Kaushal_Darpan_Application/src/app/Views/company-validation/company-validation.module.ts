import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyValidationRoutingModule } from './company-validation-routing.module';
import { CompanyValidationComponent } from './company-validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    CompanyValidationComponent
  ],
  imports: [
    CommonModule,
    CompanyValidationRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class CompanyValidationModule { }
