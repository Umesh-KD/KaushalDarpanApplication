import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { BridgeCourseReportsComponent } from './bter-bridge-course-reports.component';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [{ path: '', component: BridgeCourseReportsComponent }];

@NgModule({
  declarations: [BridgeCourseReportsComponent],
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
export class BridgeCourseReportsModule { }
