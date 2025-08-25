import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCollegeSearchRoutingModule } from './iti-college-search-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ItiCollegeSearchComponent } from './iti-college-search.component';


@NgModule({
  declarations: [
    /*    KnowMeritITIComponent*/
    ItiCollegeSearchComponent
  ],
  imports: [
    CommonModule,
    ItiCollegeSearchRoutingModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule
  ], providers: [TableSearchFilterModule]
})
export class ItiCollegeSearchModule { }
