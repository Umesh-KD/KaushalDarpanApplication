import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { ExaminerReportAndMarksTrackingComponent } from './examiner-report-and-marks-tracking.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';



const routes: Routes = [{ path: '', component: ExaminerReportAndMarksTrackingComponent }];

@NgModule({
  declarations: [
    ExaminerReportAndMarksTrackingComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule, NgSelectModule,
    CommonModule,
    LoaderModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class ExaminerReportAndMarksTrackingModule { }
