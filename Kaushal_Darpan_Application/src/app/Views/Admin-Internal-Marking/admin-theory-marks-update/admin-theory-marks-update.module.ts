import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AdminTheoryMarksUpdateComponent } from './admin-theory-marks-update.component';
import { AdminTheoryMarksUpdateRoutingModule } from './admin-theory-marks-update-routing.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    AdminTheoryMarksUpdateComponent
  ],
  imports: [
    CommonModule,
    AdminTheoryMarksUpdateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    OTPModalModule
  ]
})
export class AdminTheoryMarksUpdateModule { }

