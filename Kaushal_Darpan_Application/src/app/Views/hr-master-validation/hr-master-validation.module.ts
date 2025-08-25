import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrMasterValidationRoutingModule } from './hr-master-validation-routing.module';
import { HrMasterValidationComponent } from './hr-master-validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    HrMasterValidationComponent
  ],
  imports: [
    CommonModule,
    HrMasterValidationRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class HrMasterValidationModule { }
