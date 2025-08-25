import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchesMasterRoutingModule } from './branches-master-routing.module';
import { BranchesMasterComponent } from './branches-master.component';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    BranchesMasterComponent
  ],
  imports: [
    CommonModule,
    BranchesMasterRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class BranchesMasterModule { }
