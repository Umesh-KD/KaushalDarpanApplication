import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItiRptStatisticsComponent } from './iti-rpt-statistics.component';
import { RouterModule, Routes } from '@angular/router';
import { LoaderModule } from '../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


const routes: Routes = [
  {
  path: '', component: ItiRptStatisticsComponent
  }
];


@NgModule({
  declarations: [ItiRptStatisticsComponent],
  imports: [
    CommonModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    RouterModule.forChild(routes)
  ]
})
export class ItiRptStatisticsModule { }
