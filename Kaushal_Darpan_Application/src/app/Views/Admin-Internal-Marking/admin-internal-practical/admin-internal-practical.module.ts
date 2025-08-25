import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AdminInternalPracticalComponent } from './admin-internal-practical.component';
import { AdminInternalPracticalRoutingModule } from './admin-internal-practical-routing.module';


@NgModule({
  declarations: [
    AdminInternalPracticalComponent
  ],
  imports: [
    CommonModule,
    AdminInternalPracticalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule

  ]
})
export class AdminInternalPracticalModule { }
