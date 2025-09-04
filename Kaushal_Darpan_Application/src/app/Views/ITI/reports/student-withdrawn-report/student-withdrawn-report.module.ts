import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { studentwithdrawnreportRoutingModule } from './student-withdrawn-report-routing.module';
import { studentwithdrawnreportComponent } from './student-withdrawn-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    studentwithdrawnreportComponent
  ],
  imports: [
    CommonModule,
    studentwithdrawnreportRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    OTPModalModule
  ]
})
export class studentwithdrawnreportModule { }
