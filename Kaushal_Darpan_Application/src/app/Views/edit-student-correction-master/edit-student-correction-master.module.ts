import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { EditStudentCorrectionMasterRoutingModule } from './edit-student-correction-master.routing.module';
import { EditStudentCorrectionMasterComponent } from './edit-student-correction-master.component';

@NgModule({
  declarations: [
    EditStudentCorrectionMasterComponent
  ],
  imports: [
    CommonModule,
    EditStudentCorrectionMasterRoutingModule
    ,FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class EditStudentCorrectionMasterModule { }
