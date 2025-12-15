import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIBankGuaranteeRoutingModule } from './ITI-BankGuarantee-routing.module';
import { ITIBankGuaranteeComponent } from './ITI-BankGuarantee.component';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ITIBankGuaranteeComponent
  ],
  imports: [
    CommonModule,
    ITIBankGuaranteeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class ITIBankGuaranteeModule { }
