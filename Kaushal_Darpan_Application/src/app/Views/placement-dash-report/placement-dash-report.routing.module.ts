import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { PlacementDashReportComponent } from './placement-dash-report.component';
import { MaterialModule } from '../../material.module';
const routes: Routes = [
  {
    path: '',
    component: PlacementDashReportComponent
  }
];

@NgModule({
  declarations: [
    PlacementDashReportComponent
  ],
  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,MaterialModule],
  exports: [RouterModule],
})


export class RoleMasterRoutingModule { }
