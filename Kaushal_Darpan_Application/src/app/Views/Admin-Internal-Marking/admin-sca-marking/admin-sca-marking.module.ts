import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AdminSCAMarkingComponent } from './admin-sca-marking.component';
import { AdminSCAMarkingRoutingModule } from './admin-sca-marking-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AdminSCAMarkingComponent
  ],
  imports: [
    CommonModule,
    AdminSCAMarkingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    NgSelectModule
  ]
})
export class AdminSCAMarkingModule { }
