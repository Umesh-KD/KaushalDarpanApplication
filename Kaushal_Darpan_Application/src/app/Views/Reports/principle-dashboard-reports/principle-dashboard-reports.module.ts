import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { PrincipleDashboardReportsComponent } from './principle-dashboard-reports.component';


const routes: Routes = [{ path: '', component: PrincipleDashboardReportsComponent }];
@NgModule({
  declarations: [PrincipleDashboardReportsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ], providers: [TableSearchFilterModule]
})
export class PrincipleDashboardReportsModule { }
