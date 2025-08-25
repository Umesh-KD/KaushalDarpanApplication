import { NgModule } from '@angular/core';
import { CampusValidationRoutingModule } from './campus-validation-routing.module';
import { CampusValidationComponent } from './campus-validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module'; 
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CampusValidationComponent
  ],
  imports: [
    CommonModule,
    CampusValidationRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,

  ]
})
export class CampusValidationModule { }
