import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgeStudentDataRoutingModule } from './age-wise-student-data-routing.module';
import { AgeStudentDataComponent } from './age-wise-student-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AgeStudentDataComponent
  ],
  imports: [
    CommonModule,
    AgeStudentDataRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class AgeStudentDataModule { }
