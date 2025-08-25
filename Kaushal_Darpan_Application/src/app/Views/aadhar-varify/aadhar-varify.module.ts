import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AadharVerifyDetailComponent } from './aadhar-varify.component';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../otpmodal/otpmodal.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { AadharVerifyRoutingModule } from './aadhar-varify-routing.module';



@NgModule({
  declarations: [
    AadharVerifyDetailComponent
  ],
  imports: [
    CommonModule,
    AadharVerifyRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, OTPModalModule
  ]
})
export class AadharVerifyDetailModule { }
