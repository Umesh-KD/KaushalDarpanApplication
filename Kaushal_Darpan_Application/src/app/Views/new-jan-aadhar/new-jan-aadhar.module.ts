import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { JanAadharDetailComponent } from './new-jan-aadhar.component';
import { JanAadharDetailRoutingModule } from './new-jan-aadhar.routing.module';
import { OTPModalModule } from '../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    JanAadharDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    JanAadharDetailRoutingModule,
    OTPModalModule

  ]
})
export class JanAadharDetailModule { }
