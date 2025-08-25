import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { CollegeListComponent } from './college-list.component';
import { CollegeListRoutingModule } from './college-list-routing.module';


@NgModule({
  declarations: [
    CollegeListComponent
  ],
  imports: [
    CommonModule,
    CollegeListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class CollegeListModule { }
