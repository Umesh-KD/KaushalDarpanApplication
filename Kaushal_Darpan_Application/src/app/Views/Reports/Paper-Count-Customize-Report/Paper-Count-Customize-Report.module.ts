import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaperCountCustomizeReportComponent } from './Paper-Count-Customize-Report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

const routes: Routes = [{ path: '', component: PaperCountCustomizeReportComponent }];
@NgModule({
  declarations: [
    PaperCountCustomizeReportComponent
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
export class  PaperCountCustomizeReportModule { }
