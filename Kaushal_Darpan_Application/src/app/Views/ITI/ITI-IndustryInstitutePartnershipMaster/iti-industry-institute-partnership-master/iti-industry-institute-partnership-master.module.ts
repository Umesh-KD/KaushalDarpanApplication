import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIIndustryInstitutePartnershipMasterRoutingModule } from './iti-industry-institute-partnership-master-routing.module';
import { ITIIndustryInstitutePartnershipMasterComponent } from './iti-industry-institute-partnership-master.component';


@NgModule({
  declarations: [
    ITIIndustryInstitutePartnershipMasterComponent
  ],
  imports: [
    CommonModule,
    ITIIndustryInstitutePartnershipMasterRoutingModule,
    FormsModule, ReactiveFormsModule,  LoaderModule, TableSearchFilterModule
  ]
})
export class ITIIndustryInstitutePartnershipMasterModule { }
