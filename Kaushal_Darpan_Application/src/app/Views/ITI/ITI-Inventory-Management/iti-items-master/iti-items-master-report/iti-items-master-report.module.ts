import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { Routes, RouterModule } from '@angular/router';
import { ITIItemsMasterReportComponent } from './iti-items-master-report.component';

const routes: Routes = [{ path: '', component: ITIItemsMasterReportComponent }];


@NgModule({
  declarations: [
    ITIItemsMasterReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ITIItemsMasterReportModule { }
