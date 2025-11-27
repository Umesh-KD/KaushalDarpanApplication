import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ItiCollegeApprovedContractRptdetailsComponent } from './iti-college-approved-contract-rptdetails.component';
import { ItiCollegeApprovedContractRPTDetailsRoutingModule } from './iti-college-approved-contract-rptdetails-routing.module'; 


@NgModule({
  declarations: [
    ItiCollegeApprovedContractRptdetailsComponent
  ],
  imports: [
    CommonModule,
    ItiCollegeApprovedContractRPTDetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    TableSearchFilterModule
  ]
})
export class ItiCollegeApprovedContractRPTDetailsModule { }
