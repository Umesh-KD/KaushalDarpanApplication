import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonSubjectsRoutingModule } from './common-subjects-routing.module';
import { CommonSubjectsComponent } from './common-subjects.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  


@NgModule({
  declarations: [
    CommonSubjectsComponent
  ],
  imports: [
    CommonModule,
    CommonSubjectsRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, 
  ]
})
export class CommonSubjectsModule { }
