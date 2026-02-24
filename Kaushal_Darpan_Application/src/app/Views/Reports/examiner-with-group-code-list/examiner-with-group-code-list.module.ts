import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { ExaminerWithGroupCodeListComponent } from './examiner-with-group-code-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';



const routes: Routes = [{ path: '', component: ExaminerWithGroupCodeListComponent }];

@NgModule({
  declarations: [
    ExaminerWithGroupCodeListComponent
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
export class ExaminerWithGroupCodeListModule { }
