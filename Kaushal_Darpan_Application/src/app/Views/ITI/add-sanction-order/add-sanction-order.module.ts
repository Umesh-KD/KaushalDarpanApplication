import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSanctionOrderRoutingModule } from './add-sanction-order-routing.module';
import { AddSanctionOrderComponent } from './add-sanction-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddSanctionOrderComponent
  ],
  imports: [
    CommonModule,
    AddSanctionOrderRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddSanctionOrderModule { }
