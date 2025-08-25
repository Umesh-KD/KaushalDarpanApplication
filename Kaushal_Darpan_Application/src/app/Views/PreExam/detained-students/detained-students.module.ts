import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from '../../../material.module';
import { DetainedStudentsComponent } from './detained-students.component';
import { DetainedStudentsRoutingModule } from './detained-students-routing.module';


@NgModule({
  declarations: [
    DetainedStudentsComponent
  ],
  imports: [
    CommonModule, MaterialModule,
    DetainedStudentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class DetainedStudentsModule { }
