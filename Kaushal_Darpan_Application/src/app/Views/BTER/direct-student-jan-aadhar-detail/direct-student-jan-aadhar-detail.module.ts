import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectStudentJanAadharDetailRoutingModule } from './direct-student-jan-aadhar-detail-routing.module';
import { DirectStudentJanAadharDetailComponent } from './direct-student-jan-aadhar-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    DirectStudentJanAadharDetailComponent
  ],
  imports: [
    CommonModule,
    DirectStudentJanAadharDetailRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, OTPModalModule
  ]
})
export class DirectStudentJanAadharDetailModule { }
