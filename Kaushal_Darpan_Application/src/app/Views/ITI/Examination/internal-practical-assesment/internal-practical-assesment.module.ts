import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternalPracticalAssesmentRoutingModule } from './internal-practical-assesment-routing.module';
import { InternalPracticalAssesmentComponent } from './internal-practical-assesment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    InternalPracticalAssesmentComponent
  ],
  imports: [
    CommonModule,
    InternalPracticalAssesmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class InternalPracticalAssesmentModule { }
