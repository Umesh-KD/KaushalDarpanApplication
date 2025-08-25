import { CommonModule } from '@angular/common';
import { CollegeWiseExaminationRptComponent } from './college-wise-examination-rpt.component';
import { Routes, RouterModule } from '@angular/router';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { NgModule } from '@angular/core';


const routes: Routes = [{ path: '', component: CollegeWiseExaminationRptComponent }];
@NgModule({
  declarations: [CollegeWiseExaminationRptComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
  exports: [RouterModule]
})
export class CollegeWiseExaminationRptModule { }
