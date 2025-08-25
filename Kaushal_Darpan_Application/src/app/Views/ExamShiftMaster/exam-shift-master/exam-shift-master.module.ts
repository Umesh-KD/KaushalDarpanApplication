import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ExamShiftMasterComponent } from './exam-shift-master.component';
import { ExamShiftMasterRoutingModule } from './exam-shift-master-routing.module';



@NgModule({
  declarations: [
    ExamShiftMasterComponent
  ],
  imports: [
    CommonModule,
    ExamShiftMasterRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ExamShiftMasterModule { }
