import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NodalCollegeApprovedContractComponent } from './nodal-college-approved-contract.component';
import { NodalCollegeApprovedContractRoutingModule } from './nodal-college-approved-contract-routing.module';


@NgModule({
  declarations: [
    NodalCollegeApprovedContractComponent
  ],
  imports: [
    CommonModule,
    NodalCollegeApprovedContractRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    TableSearchFilterModule
  ]
})
export class NodalCollegeApprovedContractModule { }
