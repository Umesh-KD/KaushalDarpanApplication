import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { IndustryInstitutePartnershipMasterRoutingModule } from './industry-institute-partnership-master-routing.module';
import { IndustryInstitutePartnershipMasterComponent } from './industry-institute-partnership-master.component';


@NgModule({
  declarations: [
    IndustryInstitutePartnershipMasterComponent
  ],
  imports: [
    CommonModule,
    IndustryInstitutePartnershipMasterRoutingModule,
    FormsModule, ReactiveFormsModule,  LoaderModule, TableSearchFilterModule
  ]
})
export class IndustryInstitutePartnershipMasterModule { }
