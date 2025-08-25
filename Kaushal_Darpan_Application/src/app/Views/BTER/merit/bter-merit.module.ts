import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BterMeritComponent } from './bter-merit.component';
import { BterMeritRoutingModule } from './bter-merit-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';



@NgModule({
  declarations: [
    BterMeritComponent
  ],
  imports: [
    CommonModule,
    BterMeritRoutingModule, FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, OTPModalModule
  ]
})
export class BterMeritModule { }
