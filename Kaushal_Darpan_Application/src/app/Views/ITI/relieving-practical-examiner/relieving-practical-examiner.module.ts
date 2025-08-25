import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelievingPracticalExaminerRoutingModule } from './relieving-practical-examiner-routing.module';
import { RelievingPracticalExaminerComponent } from './relieving-practical-examiner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    RelievingPracticalExaminerComponent
  ],
  imports: [
    CommonModule,
    RelievingPracticalExaminerRoutingModule, FormsModule, ReactiveFormsModule, LoaderModule
  ]
})
export class RelievingPracticalExaminerModule { }
