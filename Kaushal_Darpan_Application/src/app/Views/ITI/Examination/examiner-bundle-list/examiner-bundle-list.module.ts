import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExaminerBundleListRoutingModule } from './examiner-bundle-list-routing.module';
import { ExaminerBundleListComponent } from './examiner-bundle-list.component';


@NgModule({
  declarations: [
    ExaminerBundleListComponent
  ],
  imports: [
    CommonModule,
    ExaminerBundleListRoutingModule
  ]
})
export class ExaminerBundleListModule { }
