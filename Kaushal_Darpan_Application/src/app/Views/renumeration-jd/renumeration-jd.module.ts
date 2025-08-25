import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenumerationJdRoutingModule } from './renumeration-jd-routing.module';
import { RenumerationJdComponent } from './renumeration-jd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    RenumerationJdComponent
  ],
  imports: [
    CommonModule,
    RenumerationJdRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class RenumerationJdModule { }
