import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { Routes, RouterModule } from '@angular/router';
import { SR5ReportBTERComponent } from './sr5-report-bter.component';

const routes: Routes = [{ path: '', component: SR5ReportBTERComponent }];


@NgModule({
  declarations: [
    SR5ReportBTERComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class SR5ReportBTERModule { }
