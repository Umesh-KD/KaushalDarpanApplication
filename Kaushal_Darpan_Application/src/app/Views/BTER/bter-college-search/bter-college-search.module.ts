import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { bterCollegeSearchRoutingModule } from './bter-college-search-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { bterCollegeSearchComponent } from './bter-college-search.component';


@NgModule({
  declarations: [
    bterCollegeSearchComponent
  ],
  imports: [
    CommonModule,
    bterCollegeSearchRoutingModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule
  ], providers: [TableSearchFilterModule]
})
export class bterCollegeSearchModel { }
