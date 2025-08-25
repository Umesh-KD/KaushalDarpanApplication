import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrievanceListRoutingModule } from './GrievanceList-routing.module';
import { GrievanceListComponent } from './GrievanceList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';

@NgModule({
  declarations: [
    GrievanceListComponent
  ],
  imports: [
    CommonModule,
    GrievanceListRoutingModule, FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class GrievanceListModule { }
