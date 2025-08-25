import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIIndustryInstitutePartnershipValidationRoutingModule } from './ITI-Industry-institute-partnership-validation-routing.module';
import { ITIIndustryInstitutePartnershipValidationComponent } from './ITI-Industry-institute-partnership-validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ITIIndustryInstitutePartnershipValidationComponent
  ],
  imports: [
    CommonModule,
    ITIIndustryInstitutePartnershipValidationRoutingModule,
    FormsModule, ReactiveFormsModule,  LoaderModule, TableSearchFilterModule
  ]
})
export class ITIIndustryInstitutePartnershipValidationModule { }
