import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { RevaluationStudentDetailReportsComponent } from './bter-student-revaluation-details-report.component';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [{ path: '', component: RevaluationStudentDetailReportsComponent }];

@NgModule({
  declarations: [RevaluationStudentDetailReportsComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule, NgSelectModule,
    CommonModule,
    LoaderModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
  exports: [RouterModule]
})
export class RevaluationStudentDetailsReportsModule { }
