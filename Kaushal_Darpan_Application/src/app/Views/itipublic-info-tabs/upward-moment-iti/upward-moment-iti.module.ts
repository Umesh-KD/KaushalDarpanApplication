import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpwardMomentITIRoutingModule } from './upward-moment-iti-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { UpwardMomentITIComponent } from './upward-moment-iti.component';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    /*UpwardMomentITIComponent*/
  ],
  imports: [
    CommonModule,
    UpwardMomentITIRoutingModule,

    FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule
  ]
})
export class UpwardMomentITIModule { }
