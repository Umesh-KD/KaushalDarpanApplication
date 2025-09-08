import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JailAdmissionAllotmentRoutingModule } from './jail-admission-allotment-routing.module';
import { JailAdmissionAllotmentComponent } from './jail-admission-allotment.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    JailAdmissionAllotmentComponent
  ],
  imports: [
    CommonModule,
    JailAdmissionAllotmentRoutingModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class JailAdmissionAllotmentModule { }
