import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIGovtOfficeComponent } from './ITI-Govt-Office.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
const routes: Routes = [
  {
    path: '',
    component: ITIGovtOfficeComponent
  }
];

@NgModule({
  declarations: [
    ITIGovtOfficeComponent

  ],

  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule, NgMultiSelectDropDownModule.forRoot()],
  exports: [RouterModule],
})


export class ITIGovtOfficeRoutingModule { }




