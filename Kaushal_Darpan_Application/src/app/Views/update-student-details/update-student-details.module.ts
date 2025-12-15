import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { UpdateStudentDetailComponent } from './update-student-details.component';
import { UpdateStudentDetailRoutingModule } from './update-student-details.routing.module';
import { OTPModalModule } from '../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    UpdateStudentDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    UpdateStudentDetailRoutingModule,
    OTPModalModule

  ]
})
export class UpdateStudentDetailModule { }
