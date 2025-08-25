import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiExamCoordinatorRoutingModule } from './iti-exam-coordinator-routing.module';
import { ItiExamCoordinatorComponent } from './iti-exam-coordinator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ItiExamCoordinatorComponent
  ],
  imports: [
    CommonModule,
    ItiExamCoordinatorRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule,
    OTPModalModule
  ]
})
export class ItiExamCoordinatorModule { }
