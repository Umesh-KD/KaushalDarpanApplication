import { CommonModule } from '@angular/common';
import { RMIFailStudentReportComponent } from './rmi-fail-student-report.component';
import { Routes, RouterModule } from '@angular/router';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { NgModule } from '@angular/core';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [{ path: '', component: RMIFailStudentReportComponent }];
@NgModule({
  declarations: [RMIFailStudentReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule, NgSelectModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
  exports: [RouterModule]
})
export class RMIFailStudentReportModule { }
