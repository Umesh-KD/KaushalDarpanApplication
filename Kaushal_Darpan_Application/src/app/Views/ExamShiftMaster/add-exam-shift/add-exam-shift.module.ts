import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AddExamShiftComponent } from './add-exam-shift.component';
import { AddExamShiftRoutingModule } from './add-exam-shift-routing.module';



@NgModule({
  declarations: [
    AddExamShiftComponent
  ],
  imports: [
    CommonModule,
    AddExamShiftRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class AddExamShiftModule { }
