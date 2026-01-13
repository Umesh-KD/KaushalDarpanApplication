import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { CandidateAllotmentListReportComponent } from '../../../Views/Counselling-Master/candidate-allotment-report/candidate-allotment-report.component';
import { CandidateAllotmentListReportRoutingModule } from '../../../Views/Counselling-Master/candidate-allotment-report/candidate-allotment-report-routing.module';


@NgModule({
  declarations: [
    CandidateAllotmentListReportComponent
  ],
  imports: [
    CommonModule,
    CandidateAllotmentListReportRoutingModule,  
    LoaderModule,
    FormsModule, 
    TableSearchFilterModule,
    ReactiveFormsModule,
    OTPModalModule,
  ]
})
export class CandidateAllotmentListReportModule { }
