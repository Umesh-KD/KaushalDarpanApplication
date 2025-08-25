import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrievanceRoutingModule } from './grievance-routing.module';
import { GrievanceComponent } from './grievance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    GrievanceComponent
  ],
  imports: [
    CommonModule,
    GrievanceRoutingModule,  FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class GrievanceModule { }
