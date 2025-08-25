import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PapersMasterRoutingModule } from './papers-master-routing.module';
import { PapersMasterComponent } from './papers-master.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    PapersMasterComponent
  ],
  imports: [
    CommonModule,
    PapersMasterRoutingModule,
    LoaderModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class PapersMasterModule { }
