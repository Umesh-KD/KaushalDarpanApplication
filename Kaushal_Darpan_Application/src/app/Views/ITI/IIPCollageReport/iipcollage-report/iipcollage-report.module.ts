import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IIPCollageReportRoutingModule } from './iipcollage-report-routing.module';
import { IIPCollageReportComponent } from './iipcollage-report.component';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    IIPCollageReportComponent
  ],
  imports: [
    CommonModule,
    IIPCollageReportRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TableSearchFilterModule, 
   
  ]
})
export class IIPCollageReportModule { }
