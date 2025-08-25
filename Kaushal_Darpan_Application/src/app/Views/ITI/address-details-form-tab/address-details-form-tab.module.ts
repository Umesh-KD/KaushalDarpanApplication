import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressDetailsFormTabRoutingModule } from './address-details-form-tab-routing.module';
import { AddressDetailsFormTabComponent } from './address-details-form-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddressDetailsFormTabComponent
  ],
  imports: [
    CommonModule,
    AddressDetailsFormTabRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class AddressDetailsFormTabModule { }
