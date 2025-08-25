import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { PaymentServiceComponent } from './payment-service.component';
import { PaymentServiceRoutingModule } from './payment-service-routing.module';


@NgModule({
  declarations: [
    PaymentServiceComponent
  ],
  imports: [
    CommonModule,
    PaymentServiceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule

    
  ]
})
export class PaymentServiceModule { }
