import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { AddPaymentServiceComponent } from './add-payment-service.component';
import { AddPaymentServiceRoutingModule } from './add-payment-service-routing.module';


@NgModule({
  declarations: [
    AddPaymentServiceComponent
  ],
  imports: [
    CommonModule,
    AddPaymentServiceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule

    
  ]
})
export class AddPaymentServiceModule { }
