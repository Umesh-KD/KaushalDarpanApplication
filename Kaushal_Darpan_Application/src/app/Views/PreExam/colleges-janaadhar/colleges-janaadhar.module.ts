import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollegesJanaadharRoutingModule } from './colleges-janaadhar-routing.module';
import { CollegesJanaadharComponent } from './colleges-janaadhar.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CollegesJanaadharComponent
  ],
  imports: [
    CommonModule,
    CollegesJanaadharRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class CollegesJanaadharModule { }
