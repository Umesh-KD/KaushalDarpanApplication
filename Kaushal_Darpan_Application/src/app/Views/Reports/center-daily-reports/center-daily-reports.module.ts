import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CenterDailyReportComponent } from './center-daily-report/center-daily-report.component';
import { CenterDailyReportsComponent } from './center-daily-reports.component';


const routes: Routes = [
  { path: '', component: CenterDailyReportsComponent },
  { path: 'reports', component: CenterDailyReportComponent }
];

@NgModule({
  declarations: [CenterDailyReportsComponent, CenterDailyReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule, NgSelectModule,
    CommonModule,
    LoaderModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
  exports: [RouterModule]
})
export class CenterDailyReportsModule { }
