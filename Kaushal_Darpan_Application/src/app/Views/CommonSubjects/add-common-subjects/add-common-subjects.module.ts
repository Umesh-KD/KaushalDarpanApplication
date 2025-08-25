import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCommonSubjectsRoutingModule } from './add-common-subjects-routing.module';
import { AddCommonSubjectsComponent } from './add-common-subjects.component';

import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    AddCommonSubjectsComponent
  ],
  imports: [
    CommonModule,
    AddCommonSubjectsRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AddCommonSubjectsModule { }
