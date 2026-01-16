import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { Routes, RouterModule } from '@angular/router';
import { SR6ReportITIComponent } from './sr6-report-iti.component';

const routes: Routes = [{ path: '', component: SR6ReportITIComponent }];

@NgModule({
  declarations: [
    SR6ReportITIComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class SR6ReportITIModule { }
