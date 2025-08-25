import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CentersRoutingModule } from './centers-routing.module';
import { CentersComponent } from './centers.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CentersComponent
  ],
  imports: [
    CommonModule,
    CentersRoutingModule,
    LoaderModule,
    TableSearchFilterModule,
    FormsModule
  ]
})
export class CentersModule { }
