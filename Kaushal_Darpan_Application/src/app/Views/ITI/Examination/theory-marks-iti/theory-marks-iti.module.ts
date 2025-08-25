import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TheoryMarksItiRoutingModule } from './theory-marks-iti-routing.module';
import { TheoryMarksItiComponent } from './theory-marks-iti.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    TheoryMarksItiComponent
  ],
  imports: [
    CommonModule,
    TheoryMarksItiRoutingModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
    LoaderModule,
    OTPModalModule
  ]
})
export class TheoryMarksItiModule { }
