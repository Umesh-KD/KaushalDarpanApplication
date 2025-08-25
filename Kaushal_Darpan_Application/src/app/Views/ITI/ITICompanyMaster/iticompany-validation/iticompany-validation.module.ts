import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItiCompanyValidationComponent } from './iticompany-validation.component';
import { ItiCompanyValidationRoutingModule } from './iticompany-validation-routing.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ItiCompanyValidationComponent
  ],
  imports: [
    CommonModule,
    ItiCompanyValidationRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ItiCompanyValidationModule { }
