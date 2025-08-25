import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentLoginRoutingModule } from './student-login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { StudentLoginComponent } from './student-login.component';


@NgModule({
  declarations: [
    StudentLoginComponent
  ],
  imports: [
    CommonModule,
    StudentLoginRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule
  ]
})
export class StudentLoginModule { }
