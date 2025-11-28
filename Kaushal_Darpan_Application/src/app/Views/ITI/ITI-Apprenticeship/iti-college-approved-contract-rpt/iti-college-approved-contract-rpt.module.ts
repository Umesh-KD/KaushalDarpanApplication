import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ItiCollegeApprovedContractRPTComponent } from './iti-college-approved-contract-rpt.component';
import { ItiCollegeApprovedContractRPTRoutingModule } from './iti-college-approved-contract-rpt-routing.module'; 


@NgModule({
  declarations: [
    ItiCollegeApprovedContractRPTComponent
  ],
  imports: [
    CommonModule,
    ItiCollegeApprovedContractRPTRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    TableSearchFilterModule
  ]
})
export class ItiCollegeApprovedContractRPTModule { }
