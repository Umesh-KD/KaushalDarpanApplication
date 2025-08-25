import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustryInstitutePartnershipValidationRoutingModule } from './industry-institute-partnership-validation-routing.module';
import { IndustryInstitutePartnershipValidationComponent } from './industry-institute-partnership-validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    IndustryInstitutePartnershipValidationComponent
  ],
  imports: [
    CommonModule,
    IndustryInstitutePartnershipValidationRoutingModule,
    FormsModule, ReactiveFormsModule,  LoaderModule, TableSearchFilterModule
  ]
})
export class IndustryInstitutePartnershipValidationModule { }
