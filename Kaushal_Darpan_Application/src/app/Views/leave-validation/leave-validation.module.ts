import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveValidationRoutingModule } from './leave-validation-routing.module';
import { LeaveValidationComponent } from './leave-validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { TableSearchFilterPipe } from '../../Pipes/table-search-filter.pipe';


@NgModule({
  declarations: [
    LeaveValidationComponent
  ],
  imports: [
    CommonModule,
    LeaveValidationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class LeaveValidationModule { }
