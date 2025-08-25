import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { StaticsReportProvideByExaminerComponent } from './statics-report-provide-by-examiner.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';



const routes: Routes = [{ path: '', component: StaticsReportProvideByExaminerComponent }];

@NgModule({
  declarations: [
    StaticsReportProvideByExaminerComponent
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
export class StaticsReportProvideByExaminerModule { }
