import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaperCountReportComponent } from './Paper-Count-Report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

const routes: Routes = [{ path: '', component: PaperCountReportComponent }];

@NgModule({
  declarations: [
    PaperCountReportComponent
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
export class  PaperCountReportModule { }
