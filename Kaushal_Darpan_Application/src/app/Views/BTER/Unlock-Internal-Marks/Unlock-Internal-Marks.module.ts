import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnlockInternalMarksComponentRoutingModule } from './Unlock-Internal-Marks-routing.module';
import { UnlockInternalMarksComponent } from './Unlock-Internal-Marks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    UnlockInternalMarksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, UnlockInternalMarksComponentRoutingModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class UnlockInternalMarksModule { }
