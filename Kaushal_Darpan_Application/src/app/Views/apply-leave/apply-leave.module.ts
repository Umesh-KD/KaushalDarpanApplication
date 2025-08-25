import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplyLeaveRoutingModule } from './apply-leave-routing.module';
import { ApplyLeaveComponent } from './apply-leave.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ApplyLeaveComponent
  ],
  imports: [
    CommonModule,
    ApplyLeaveRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule

  ]
})
export class ApplyLeaveModule { }
