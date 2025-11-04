import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { CollegeApprovedContractListAdminComponent } from './college-approved-contract-list-admin.component';
import { CollegeApprovedContractListAdminRoutingModule } from './college-approved-contract-list-admin-routing.module';


@NgModule({
  declarations: [
    CollegeApprovedContractListAdminComponent
  ],
  imports: [
    CommonModule,
    CollegeApprovedContractListAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    TableSearchFilterModule
  ]
})
export class CollegeApprovedContractListAdminModule { }
