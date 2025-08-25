import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITIDirectStudentJanAadharDetailComponent } from './iti-direct-student-jan-aadhar-detail.component';
import { ITIDirectStudentJanAadharDetailRoutingModule } from './iti-direct-student-jan-aadhar-detail-routing.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIDirectStudentJanAadharDetailComponent
  ],
  imports: [
    CommonModule,
    ITIDirectStudentJanAadharDetailRoutingModule,
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule, 
    OTPModalModule
  ]
})
export class ITIDirectStudentJanAadharDetailModule { }
