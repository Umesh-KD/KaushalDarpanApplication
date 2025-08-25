import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { RouterModule, Routes } from '@angular/router';
import { StudentEnrollmentAdmittedComponent } from './student-enrollment-admitted.component';

const routes: Routes = [{ path: '', component: StudentEnrollmentAdmittedComponent }];
@NgModule({
  declarations: [
    StudentEnrollmentAdmittedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    RouterModule.forChild(routes)
  ]
})
export class StudentEnrollmentAdmittedModule { }
