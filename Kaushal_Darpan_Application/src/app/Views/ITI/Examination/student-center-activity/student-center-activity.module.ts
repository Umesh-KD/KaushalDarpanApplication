import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentCenterActivityRoutingModule } from './student-center-activity-routing.module';
import { StudentCenterActivityComponent } from './student-center-activity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    StudentCenterActivityComponent
  ],
  imports: [
    CommonModule,
    StudentCenterActivityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class StudentCenterActivityModule { }
