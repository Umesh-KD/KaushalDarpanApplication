import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateAdmitCardBulkRoutingModule } from './generate-admit-card-bulk-routing.module';
import { GenerateAdmitCardBulkComponent } from './generate-admit-card-bulk.component';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    GenerateAdmitCardBulkComponent
  ],
  imports: [
    CommonModule,
    GenerateAdmitCardBulkRoutingModule,
    LoaderModule
  ]
})
export class GenerateAdmitCardBulkModule { }
