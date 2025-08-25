import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentDetailUpdateRoutingModule } from './student-detail-update-routing.module';
import { StudentDetailUpdateComponent } from './student-detail-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    StudentDetailUpdateComponent
  ],
  imports: [
    CommonModule,
    StudentDetailUpdateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,

  ]
})
export class StudentDetailUpdateModule { }
