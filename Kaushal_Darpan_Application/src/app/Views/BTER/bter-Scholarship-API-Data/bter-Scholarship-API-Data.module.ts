import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { bterScholarshipAPIDataRoutingModule } from './bter-Scholarship-API-Data-routing.module';
import { bterScholarshipAPIDataComponent } from './bter-Scholarship-API-Data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    bterScholarshipAPIDataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, bterScholarshipAPIDataRoutingModule
  ]
})
export class bterScholarshipAPIDataModule { }
