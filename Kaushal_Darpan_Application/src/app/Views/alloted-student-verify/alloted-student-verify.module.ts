import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { RouterModule, Routes } from '@angular/router';
import { AllotedStudentVerifyComponent } from './alloted-student-verify.component';

const routes: Routes = [{ path: '', component: AllotedStudentVerifyComponent }];
@NgModule({
  declarations: [
    AllotedStudentVerifyComponent
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
export class AllotedStudentVerifyModule { }
