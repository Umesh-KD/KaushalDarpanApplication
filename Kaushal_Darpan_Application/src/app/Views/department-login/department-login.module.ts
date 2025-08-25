import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentLoginRoutingModule } from './department-login-routing.module';
import { DepartmentLoginComponent } from './department-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DepartmentLoginComponent
  ],
  imports: [
    CommonModule,
    DepartmentLoginRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DepartmentLoginModule { }
