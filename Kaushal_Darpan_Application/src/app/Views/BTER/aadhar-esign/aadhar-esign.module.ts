import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AadharEsignRoutingModule } from './aadhar-esign-routing.module';
import { AadharEsignComponent } from './aadhar-esign.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AadharEsignComponent
  ],
  imports: [
    CommonModule,
    AadharEsignRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class AadharEsignModule { }
