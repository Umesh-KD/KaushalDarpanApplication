import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateEnrollmentITIRoutingModule } from './generate-enrollment-iti-routing.module';
import { GenerateEnrollmentITIComponent } from './generate-enrollment-iti.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    GenerateEnrollmentITIComponent
  ],
  imports: [
    CommonModule,
    GenerateEnrollmentITIRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class GenerateEnrollmentITIModule { }
