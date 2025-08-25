import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterModule, Routes } from '@angular/router';
import { ItiStudentExamReportsComponent } from './iti-student-exam-reports.component';

const routes: Routes = [{ path: '', component: ItiStudentExamReportsComponent }];
@NgModule({
  declarations: [
    ItiStudentExamReportsComponent
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
export class ItiStudentExamReportsModule { }

