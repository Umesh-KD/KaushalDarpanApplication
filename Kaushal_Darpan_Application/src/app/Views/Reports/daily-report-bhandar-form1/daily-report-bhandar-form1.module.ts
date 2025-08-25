import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { DailyReportBhandarForm1Component } from './daily-report-bhandar-form1.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: DailyReportBhandarForm1Component }];

@NgModule({
  declarations: [
    DailyReportBhandarForm1Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    [RouterModule.forChild(routes)],
  ]
})
export class DailyReportBhandarForm1Module { }
