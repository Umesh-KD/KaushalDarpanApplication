import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentEnrollmentRoutingModule } from './student-enrollment-routing.module';
import { StudentEnrollmentComponent } from './student-enrollment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    StudentEnrollmentComponent
  ],
  imports: [
    CommonModule,
    StudentEnrollmentRoutingModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
  ]
})
export class StudentEnrollmentModule { }
