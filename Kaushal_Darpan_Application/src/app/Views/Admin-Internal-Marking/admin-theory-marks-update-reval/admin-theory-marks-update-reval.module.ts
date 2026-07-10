import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminTheoryMarksUpdateRevalRoutingModule } from './admin-theory-marks-update-reval-routing.module';
import { AdminTheoryMarksUpdateRevalComponent } from './admin-theory-marks-update-reval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AdminTheoryMarksUpdateRevalComponent
  ],
  imports: [
    CommonModule,
    AdminTheoryMarksUpdateRevalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    OTPModalModule,
    NgSelectModule,
  ]
})
export class AdminTheoryMarksUpdateRevalModule { }
