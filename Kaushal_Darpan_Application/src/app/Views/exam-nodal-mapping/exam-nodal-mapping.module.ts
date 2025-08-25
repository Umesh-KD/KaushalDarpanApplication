import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamNodalMappingRoutingModule } from './exam-nodal-mapping-routing.module';
import { ExamNodalMappingComponent } from './exam-nodal-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ExamNodalMappingComponent
  ],
  imports: [
    CommonModule,
    ExamNodalMappingRoutingModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
    OTPModalModule  
  ]
})
export class ExamNodalMappingModule { }
