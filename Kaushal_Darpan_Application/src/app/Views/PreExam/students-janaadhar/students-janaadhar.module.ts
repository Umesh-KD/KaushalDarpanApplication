import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsJanaadharRoutingModule } from './students-janaadhar-routing.module';
import { StudentsJanaadharComponent } from './students-janaadhar.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StudentsJanaadharComponent
  ],
  imports: [
    CommonModule,
    StudentsJanaadharRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class StudentsJanaadharModule { }
