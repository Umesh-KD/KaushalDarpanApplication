import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RevokePartiallyDetainedStudentsComponent } from './revoke-partially-detained-students.component';
import { RevokePartiallyDetainedStudentsRoutingModule } from './revoke-partially-detained-students-routing.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    RevokePartiallyDetainedStudentsComponent
  ],
  imports: [
    CommonModule,
    RevokePartiallyDetainedStudentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class RevokePartiallyDetainedStudentsModule { }
