import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternalPracticalRptViewRoutingModule } from './internal-practical-rpt-view-routing.module';
import { InternalPracticalRptViewComponent } from './internal-practical-rpt-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    InternalPracticalRptViewComponent
  ],
  imports: [
    CommonModule,
    InternalPracticalRptViewRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class InternalPracticalRptViewModule { }
