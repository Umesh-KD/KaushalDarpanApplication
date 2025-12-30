import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { CounsellingCandidateListReportComponent } from '../../../Views/Counselling-Master/counselling-candidate-list-report/counselling-candidate-list-report.component';
import { CounsellingCandidateListReportRoutingModule } from '../../../Views/Counselling-Master/counselling-candidate-list-report/counselling-candidate-list-report-routing.module';


@NgModule({
  declarations: [
    CounsellingCandidateListReportComponent
  ],
  imports: [
    CommonModule,
    CounsellingCandidateListReportRoutingModule,  
    LoaderModule,
    FormsModule, 
    TableSearchFilterModule,
    ReactiveFormsModule,
    OTPModalModule,
  ]
})
export class CounsellingCandidateListReportModule { }
