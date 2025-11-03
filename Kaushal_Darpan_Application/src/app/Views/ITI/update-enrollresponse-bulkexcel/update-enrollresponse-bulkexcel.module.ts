import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { UpdateEnrollResponseBulkExcelComponent } from './update-enrollresponse-bulkexcel.component';
import { UpdateEnrollResponseBulkExcelRoutingModule } from './update-enrollresponse-bulkexcel.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    UpdateEnrollResponseBulkExcelComponent
  ],
  imports: [
    CommonModule,
    UpdateEnrollResponseBulkExcelRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule
  ]
})
export class UpdateEnrollResponseBulkExcelModule { }
