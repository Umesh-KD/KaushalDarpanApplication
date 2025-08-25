import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AbcIdStudentDetailsComponent } from './abc-id-student-details.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { AbcIdStudentDetailsRoutingModule } from './abc-id-student-details.routing.module';



@NgModule({
  declarations: [
    AbcIdStudentDetailsComponent,
  ],
  imports: [
    CommonModule,
    AbcIdStudentDetailsRoutingModule ,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    CommonModule
  ]
})
export class AbcIdStudentDetailsModule { }
