import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayExamFeeRoutingModule } from './pay-exam-fee-routing.module';
import { PayExamFeeComponent } from './pay-exam-fee.component';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    PayExamFeeComponent
  ],
  imports: [
    CommonModule,
    PayExamFeeRoutingModule,
    LoaderModule, FormsModule, ReactiveFormsModule

  ]
})
export class PayExamFeeModule { }
