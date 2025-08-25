import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { CollegeWiseReportsComponent } from './college-wise-reports.component';


const routes: Routes = [{ path: '', component: CollegeWiseReportsComponent }];

@NgModule({
  declarations: [CollegeWiseReportsComponent],
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
export class CollegeWiseReportsModule { }
