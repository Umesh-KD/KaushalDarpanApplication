import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenumerationExaminerRevalRoutingModule } from './renumeration-examiner-reval-routing.module';
import { RenumerationExaminerRevalComponent } from './renumeration-examiner-reval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    RenumerationExaminerRevalComponent
  ],
  imports: [
    CommonModule,
    RenumerationExaminerRevalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class RenumerationExaminerRevalModule { }
