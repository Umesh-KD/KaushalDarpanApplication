import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentEmployementHistoryComponent } from './employement-history.component';
import { StudentEmployementHistoryRoutingModule } from './employement-history.routing.module';

@NgModule({
  declarations: [
    StudentEmployementHistoryComponent
  ],
  imports: [
    CommonModule,
    StudentEmployementHistoryRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class StudentEmployementHistoryModule { }
