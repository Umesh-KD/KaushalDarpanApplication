import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterSuperintendentStudentRoutingModule } from './center-superintendent-student-routing.module';
import { CenterSuperintendentStudentComponent } from './center-superintendent-student.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    CenterSuperintendentStudentComponent
  ],
  imports: [
    CommonModule,
    CenterSuperintendentStudentRoutingModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class CenterSuperintendentStudentModule { }
