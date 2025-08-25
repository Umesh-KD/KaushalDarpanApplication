import { CommonModule } from '@angular/common';
import { UFMStudentReportComponent } from './ufm-student-report.component';
import { Routes, RouterModule } from '@angular/router';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { NgModule } from '@angular/core';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


const routes: Routes = [{ path: '', component: UFMStudentReportComponent }];
@NgModule({
  declarations: [UFMStudentReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
  exports: [RouterModule]
})
export class UFMStudentReportModule { }
