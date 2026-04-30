import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItiStudentdetailByEnrollmentComponent } from './iti-studentdetail-by-enrollment.component';
import { RouterModule, Routes } from '@angular/router';
import { LoaderModule } from '../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../otpmodal/otpmodal.module';
import { ItiStudentdetailByEnrollmentRoutingModule } from './iti-studentdetail-by-enrollment-routing.module';

// const routes: Routes = [
//   {
//   path: '', component: ItiStudentdetailByEnrollmentComponent
//   }
// ];

@NgModule({
  declarations: [
    ItiStudentdetailByEnrollmentComponent
  ],
  imports: [
    CommonModule,
    ItiStudentdetailByEnrollmentRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    OTPModalModule
    // RouterModule.forChild(routes)
  ]
})
export class ItiStudentdetailByEnrollmentModule { }
