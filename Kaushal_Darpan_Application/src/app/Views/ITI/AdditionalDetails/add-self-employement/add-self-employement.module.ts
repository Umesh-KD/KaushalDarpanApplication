import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { AddStudentEmployementRoutingModule } from './add-self-employement.routing.module';
import {AddStudentEmployementComponent } from './add-self-employement.component';

@NgModule({
  declarations: [
    AddStudentEmployementComponent
  ],
  imports: [
    CommonModule,
   AddStudentEmployementRoutingModule
    ,FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class AddStudentEmployementModule { }
