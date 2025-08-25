import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIInvigilatorPaymentRequestRoutingModule } from './iti-invigilator-payment-request-routing.module';
import { ITIInvigilatorPaymentRequestComponent } from './iti-invigilator-payment-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    ITIInvigilatorPaymentRequestComponent
  ],
  imports: [
    CommonModule,
    ITIInvigilatorPaymentRequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule,
  ]
})
export class ITIInvigilatorPaymentRequestModule { }
