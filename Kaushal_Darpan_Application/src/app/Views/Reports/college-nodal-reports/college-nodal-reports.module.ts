import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeNodalReportsComponent } from './college-nodal-reports.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';

const routes: Routes = [{ path: '', component: CollegeNodalReportsComponent }];

@NgModule({
  declarations: [CollegeNodalReportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    LoaderModule, MaterialModule
  ],providers:[TableSearchFilterModule]
})
export class CollegeNodalReportsModule { }
