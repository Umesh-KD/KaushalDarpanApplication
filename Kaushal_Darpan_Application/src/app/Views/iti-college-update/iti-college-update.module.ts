import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCollegeUpdateRoutingModule } from './iti-college-update-routing.module';
import { ItiCollegeUpdateComponent } from './iti-college-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItiCollegeUpdateComponent
  ],
  imports: [
    CommonModule,
    ItiCollegeUpdateRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ItiCollegeUpdateModule { }
