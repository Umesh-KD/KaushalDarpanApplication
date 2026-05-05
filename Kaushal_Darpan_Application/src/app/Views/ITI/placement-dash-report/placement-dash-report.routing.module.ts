import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ITIPlacementDashReportComponent } from './placement-dash-report.component';
import { MaterialModule } from '../../../material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
const routes: Routes = [
  {
    path: '',
    component: ITIPlacementDashReportComponent
  }
];

@NgModule({
  declarations: [
    ITIPlacementDashReportComponent
  ],
  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,MaterialModule,  NgMultiSelectDropDownModule.forRoot()],
  exports: [RouterModule],
})


export class ITIPlacementDashReportModule { }
