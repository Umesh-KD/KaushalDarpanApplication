import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { GenerateEnrollComponent } from './generate-enroll.component';
import { GenerateEnrollRoutingModule } from './generate-enroll.routing.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';





@NgModule({
  declarations: [
    GenerateEnrollComponent
  ],
  imports: [
    CommonModule,
    GenerateEnrollRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,

  ]
})
export class GenerateEnrollModule { }
