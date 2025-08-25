import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddIndustryInstitutePartnershipMasterRoutingModule } from './add-industry-institute-partnership-master-routing.module';
import { AddIndustryInstitutePartnershipMasterComponent } from './add-industry-institute-partnership-master.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    AddIndustryInstitutePartnershipMasterComponent
  ],
  imports: [
    CommonModule,
    AddIndustryInstitutePartnershipMasterRoutingModule,
     FormsModule, ReactiveFormsModule,  LoaderModule, TableSearchFilterModule
  ]
})
export class AddIndustryInstitutePartnershipMasterModule { }
