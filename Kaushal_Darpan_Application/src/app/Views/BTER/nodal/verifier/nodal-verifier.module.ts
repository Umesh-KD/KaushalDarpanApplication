import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { RouterModule, Routes } from '@angular/router';
import { TotalStudentReportedListComponent } from './total-student-reported-list/total-student-reported-list.component';
import { MaterialModule } from '../../../../material.module';

const routes: Routes = [
  { path: '', component: TotalStudentReportedListComponent }
  
];

@NgModule({
  declarations: [TotalStudentReportedListComponent],
  imports: [
    CommonModule,
    FormsModule, MaterialModule,
    LoaderModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class NodalVerifierModule { }
