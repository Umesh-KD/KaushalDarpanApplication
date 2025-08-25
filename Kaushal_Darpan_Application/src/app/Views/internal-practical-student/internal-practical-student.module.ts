import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InternalPracticalStudentComponent } from './internal-practical-student.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { InternalPracticalStudentRoutingModule } from './internal-practical-student.routing.module';

@NgModule({
  declarations: [
    InternalPracticalStudentComponent
  ],
  imports: [
    CommonModule, InternalPracticalStudentRoutingModule,
     FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class InternalPracticalStudentModule { }
