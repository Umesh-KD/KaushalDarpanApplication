import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddItiTradeRoutingModule } from './add-iti-trade-routing.module';
import { AddItiTradeComponent } from './add-iti-trade.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';

@NgModule({
  declarations: [
    AddItiTradeComponent
  ],
  imports: [
    CommonModule,
    AddItiTradeRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule
  ]
})
export class AddItiTradeModule { }
