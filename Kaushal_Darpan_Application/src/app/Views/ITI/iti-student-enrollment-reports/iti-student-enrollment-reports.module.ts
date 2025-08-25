import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ItiStudentEnrollmentReportsComponent } from './iti-student-enrollment-reports.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ItiStudentEnrollmentReportsComponent }];
@NgModule({
  declarations: [
    ItiStudentEnrollmentReportsComponent
  ],
  imports: [
    ScrollingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ], providers: [TableSearchFilterModule]
})
export class ItiStudentEnrollmentReportsModule { }
