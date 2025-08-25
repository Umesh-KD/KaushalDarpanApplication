import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaperSetterListRoutingModule } from './paper-setter-list-routing.module';
import { PaperSetterListComponent } from './paper-setter-list.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    PaperSetterListComponent
  ],
  imports: [
    CommonModule,
    PaperSetterListRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class PaperSetterListModule { }
