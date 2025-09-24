import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegenerateHostelMeritComponent } from './regenerate-hostel-merit.component';
import { RegenerateHostelMeritRoutingModule } from './regenerate-hostel-merit-routing.module';


@NgModule({
  declarations: [
    RegenerateHostelMeritComponent
  ],
  imports: [
    CommonModule,
    RegenerateHostelMeritRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class RegenerateHostelMeritModule { }
