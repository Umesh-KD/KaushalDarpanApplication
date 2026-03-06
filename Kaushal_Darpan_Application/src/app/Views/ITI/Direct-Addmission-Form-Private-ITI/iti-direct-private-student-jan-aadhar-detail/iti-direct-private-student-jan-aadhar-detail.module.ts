import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITIDirectprivateStudentJanAadharDetailComponent } from './iti-direct-private-student-jan-aadhar-detail.component';
import { ITIDirectprivateStudentJanAadharDetailRoutingModule } from './iti-direct-private-student-jan-aadhar-detail-routing.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { JanAadharDetailModule } from '../../../new-jan-aadhar/new-jan-aadhar.module';

@NgModule({
  declarations: [
    ITIDirectprivateStudentJanAadharDetailComponent,

  ],
  imports: [
    CommonModule,
    ITIDirectprivateStudentJanAadharDetailRoutingModule,
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule, 
    OTPModalModule, JanAadharDetailModule

  ]
})
export class ITIDirectprivateStudentJanAadharDetailModule { }
