import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ITIAddIndustryInstitutePartnershipMasterRoutingModule } from './iti-add-industry-institute-partnership-master-routing.module';
import { ITIAddIndustryInstitutePartnershipMasterComponent } from './iti-add-industry-institute-partnership-master.component';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    ITIAddIndustryInstitutePartnershipMasterComponent
  ],
  imports: [
    CommonModule,
    ITIAddIndustryInstitutePartnershipMasterRoutingModule,
     FormsModule, ReactiveFormsModule,  LoaderModule, TableSearchFilterModule
  ]
})
export class ITIAddIndustryInstitutePartnershipMasterModule { }
