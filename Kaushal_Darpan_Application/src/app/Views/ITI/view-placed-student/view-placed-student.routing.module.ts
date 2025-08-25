import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ViewPlacedStudentComponent } from './view-placed-student.component';
const routes: Routes = [
  {
    path: '',
    component: ViewPlacedStudentComponent
  }
];

@NgModule({
  declarations: [
    ViewPlacedStudentComponent
  ],
  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule],
  exports: [RouterModule],
})


export class ViewPlacedStudentRoutingModule { }
