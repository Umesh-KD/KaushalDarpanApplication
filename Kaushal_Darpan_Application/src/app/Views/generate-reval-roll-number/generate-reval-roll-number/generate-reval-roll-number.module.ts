
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { GenerateRevalRollNumberComponent } from './generate-reval-roll-number.component';
import { GenerateRevalRollNumberRoutingModule } from './generate-reval-roll-number-routing.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    GenerateRevalRollNumberComponent
  ],
  imports: [
    CommonModule,
    GenerateRevalRollNumberRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,

  ]
})
export class GenerateRevalRollNumberModule { }
