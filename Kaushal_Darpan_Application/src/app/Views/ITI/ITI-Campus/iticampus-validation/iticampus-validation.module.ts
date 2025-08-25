import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ItiCampusValidationRoutingModule } from './iticampus-validation-routing.module';
import { ItiCampusValidationComponent } from './iticampus-validation.component';

@NgModule({
  declarations: [
    ItiCampusValidationComponent
  ],
  imports: [
    CommonModule,
    ItiCampusValidationRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,

  ]
})
export class ItiCampusValidationModule { }
