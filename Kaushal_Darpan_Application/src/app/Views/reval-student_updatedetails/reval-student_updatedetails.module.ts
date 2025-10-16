import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { RevalStudentUpdateDetailsComponent } from './reval-student_updatedetails.component';
import { RevalStudentUpdateDetailsRoutingModule } from './reval-student_updatedetails.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OTPModalModule } from '../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    RevalStudentUpdateDetailsComponent
  ],
  imports: [
    CommonModule,
    RevalStudentUpdateDetailsRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule,
    OTPModalModule,
  ]
})
export class RevalStudentUpdateDetailsModule { }
