import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NotWorkingItemReportComponent } from './NotWorkingItemReport.component';

import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';

const routes: Routes = [
  { path: '', component: NotWorkingItemReportComponent }
];

@NgModule({
  declarations: [
    NotWorkingItemReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class NotWorkingItemReportModule { }
