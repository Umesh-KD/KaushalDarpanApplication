import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { GenerateAdmitcardComponent } from './generate-admitcard.component';
import { GenerateAdmitcardRoutingModule } from './generate-admitcard.routing.module'
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';




@NgModule({
  declarations: [
    GenerateAdmitcardComponent
  ],
  imports: [
    CommonModule,
    GenerateAdmitcardRoutingModule,

    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,

  ]
})
export class   GenerateAdmitcardModule { }
