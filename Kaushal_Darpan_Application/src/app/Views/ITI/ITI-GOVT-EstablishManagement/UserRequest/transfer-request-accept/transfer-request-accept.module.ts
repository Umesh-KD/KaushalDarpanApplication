import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { TransferRequestAcceptComponent } from './transfer-request-accept.component';
import { TransferRequestAcceptRoutingModule } from './transfer-request-accept-routing.module';
import { OTPModalModule } from '../../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    TransferRequestAcceptComponent
  ],
  imports: [
    CommonModule,
    TransferRequestAcceptRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    OTPModalModule
  ]
})
export class TransferRequestAcceptModule { }
