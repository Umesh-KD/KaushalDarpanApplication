import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterAndSubjectWiseReportComponent } from './Center-And-Subject-Wise-Report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

const routes: Routes = [{ path: '', component: CenterAndSubjectWiseReportComponent }];
@NgModule({
  declarations: [
    CenterAndSubjectWiseReportComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class  CenterAndSubjectWiseReportModule { }
