import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { DirectHostelAllotmentComponent } from './direct-hostel-allotment.component';
import { DirectHostelAllotmentRoutingModule } from './direct-hostel-allotment-routing.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    DirectHostelAllotmentComponent
  ],
  imports: [
    CommonModule,
    DirectHostelAllotmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    OTPModalModule,
  ],
})
export class DirectHostelAllotmentModule { }
