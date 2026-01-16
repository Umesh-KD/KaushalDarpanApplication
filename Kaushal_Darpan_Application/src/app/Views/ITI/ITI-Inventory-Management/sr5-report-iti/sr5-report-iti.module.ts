import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { Routes, RouterModule } from '@angular/router';
import { SR5ReportITIComponent } from './sr5-report-iti.component';

const routes: Routes = [{ path: '', component: SR5ReportITIComponent }];

@NgModule({
  declarations: [
    SR5ReportITIComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class SR5ReportITIModule { }
