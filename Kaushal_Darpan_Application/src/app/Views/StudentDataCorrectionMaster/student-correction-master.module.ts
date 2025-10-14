import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { StudentCorrectionMasterComponent } from './student-correction-master.component';
import { StudentCorrectionMasterRoutingModule } from './student-correction-master.routing.module';

@NgModule({
  declarations: [
    StudentCorrectionMasterComponent
  ],
  imports: [
    CommonModule,
    StudentCorrectionMasterRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class StudentCorrectionMasterModule { }
