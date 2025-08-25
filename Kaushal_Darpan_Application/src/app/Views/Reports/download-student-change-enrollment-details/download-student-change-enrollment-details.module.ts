import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { DownloadStudentChangeEnrollmentDetailsComponent } from './download-student-change-enrollment-details.component';



const routes: Routes = [{ path: '', component: DownloadStudentChangeEnrollmentDetailsComponent }];


@NgModule({
  declarations: [DownloadStudentChangeEnrollmentDetailsComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule, NgSelectModule,
    CommonModule,
    LoaderModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class DownloadStudentChangeEnrollmentDetailsModule { }
