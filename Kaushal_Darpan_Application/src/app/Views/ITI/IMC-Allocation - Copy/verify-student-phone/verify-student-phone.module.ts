import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyStudentPhoneRoutingModule } from './verify-student-phone-routing.module';
import { VerifyStudentPhoneComponent } from './verify-student-phone.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    VerifyStudentPhoneComponent
  ],
  imports: [
    CommonModule,
    VerifyStudentPhoneRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class VerifyStudentPhoneModule { }
