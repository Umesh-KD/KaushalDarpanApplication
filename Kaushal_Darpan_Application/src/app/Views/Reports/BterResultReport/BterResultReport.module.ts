import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BterResultReportComponent } from './BterResultReport.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

const routes: Routes = [{ path: '', component: BterResultReportComponent }];

@NgModule({
  declarations: [
    BterResultReportComponent
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
export class  BterResultReportModule { }
