import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenumerationJdRevalRoutingModule } from './renumeration-jd-reval-routing.module';
import { RenumerationJdRevalComponent } from './renumeration-jd-reval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    RenumerationJdRevalComponent
  ],
  imports: [
    CommonModule,
    RenumerationJdRevalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class RenumerationJdRevalModule { }
