import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenumerationExaminerRoutingModule } from './renumeration-examiner-routing.module';
import { RenumerationExaminerComponent } from './renumeration-examiner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    RenumerationExaminerComponent
  ],
  imports: [
    CommonModule,
    RenumerationExaminerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class RenumerationExaminerModule { }
