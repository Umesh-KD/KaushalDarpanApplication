import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScholarshipGetDataRoutingModule } from './scholarship-get-data-routing.module';
import { ScholarshipGetDataComponent } from './scholarship-get-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ScholarshipGetDataComponent
  ],
  imports: [
    CommonModule,
    ScholarshipGetDataRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule
  ]
})
export class ScholarshipGetDataModule { }
