import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaperSetterRoutingModule } from './paper-setter-routing.module';
import { PaperSetterComponent } from './paper-setter.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    PaperSetterComponent
  ],
  imports: [
    CommonModule,
    PaperSetterRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class PaperSetterModule { }
