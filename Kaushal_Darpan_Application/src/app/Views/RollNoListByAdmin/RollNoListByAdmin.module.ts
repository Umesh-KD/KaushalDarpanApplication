import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { RollNoListByAdminComponent } from './RollNoListByAdmin.component';
import { GenerateRollRoutingModule } from './RollNoListByAdmin.routing.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../material.module';





@NgModule({
  declarations: [
    RollNoListByAdminComponent
  ],
  imports: [
    CommonModule,
    GenerateRollRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,MaterialModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,

  ]
})
export class  RollNoListByAdminModule { }
