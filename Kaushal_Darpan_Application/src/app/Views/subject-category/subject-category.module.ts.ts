import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { SubjectCategoryComponent } from './subject-category.component';
import { LoaderModule } from '../Shared/loader/loader.module';
const routes: Routes = [
  {
    path: '',
    component: SubjectCategoryComponent
  }
];

@NgModule({
  declarations: [
    SubjectCategoryComponent,

  ],

  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule],
  exports: [RouterModule],
})


export class SubjectCategoryRoutingModule { }




