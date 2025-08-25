import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { VerifyITIInspectionComponent } from './verify-iti-inspection.component';
import { VerifyITIInspectionRoutingModule } from './verify-iti-inspection-routing.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    VerifyITIInspectionComponent
  ],
  imports: [
    CommonModule,
    VerifyITIInspectionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    OTPModalModule
  ]
})
export class VerifyITIInspectionModule { }
