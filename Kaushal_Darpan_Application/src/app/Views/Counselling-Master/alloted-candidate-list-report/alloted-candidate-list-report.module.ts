import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { AllotedCandidateListReportComponent } from '../../../Views/Counselling-Master/alloted-candidate-list-report/alloted-candidate-list-report.component';
import { AllotedCandidateListReportRoutingModule } from '../../../Views/Counselling-Master/alloted-candidate-list-report/alloted-candidate-list-report-routing.module';


@NgModule({
  declarations: [
    AllotedCandidateListReportComponent
  ],
  imports: [
    CommonModule,
    AllotedCandidateListReportRoutingModule,  
    LoaderModule,
    FormsModule, 
    TableSearchFilterModule,
    ReactiveFormsModule,
    OTPModalModule,
  ]
})
export class AllotedCandidateListReportModule { }
