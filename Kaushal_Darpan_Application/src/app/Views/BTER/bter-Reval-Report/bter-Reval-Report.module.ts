import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { bterRevalReportRoutingModule } from './bter-Reval-Report-routing.module';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { bterRevalReportComponent } from './bter-Reval-Report.component';  


@NgModule({
  declarations: [
    bterRevalReportComponent
  ],
  imports: [
    CommonModule,
    bterRevalReportRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class bterRevalReportModule { }
