import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ExcelOperationComponent } from './excel-operation.component';
import { ExcelOperationRoutingModule } from './excel-operation.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ExcelOperationComponent
  ],
  imports: [
    CommonModule,
    ExcelOperationRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule
  ]
})
export class ExcelOperationModule { }
