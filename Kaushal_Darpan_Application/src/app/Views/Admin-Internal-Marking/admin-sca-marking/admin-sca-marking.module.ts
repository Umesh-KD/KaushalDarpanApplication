import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AdminSCAMarkingComponent } from './admin-sca-marking.component';
import { AdminSCAMarkingRoutingModule } from './admin-sca-marking-routing.module';


@NgModule({
  declarations: [
    AdminSCAMarkingComponent
  ],
  imports: [
    CommonModule,
    AdminSCAMarkingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule

  ]
})
export class AdminSCAMarkingModule { }
