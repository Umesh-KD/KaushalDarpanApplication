import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditStudentJanaadharRoutingModule } from './add-edit-student-janaadhar-routing.module';
import { AddEditStudentJanaadharComponent } from './add-edit-student-janaadhar.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddEditStudentJanaadharComponent
  ],
  imports: [
    CommonModule,
    AddEditStudentJanaadharRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class AddEditStudentJanaadharModule { }
