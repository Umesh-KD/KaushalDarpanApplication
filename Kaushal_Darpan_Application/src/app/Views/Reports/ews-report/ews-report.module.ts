import { CommonModule } from '@angular/common';
import { EWSReportComponent } from './ews-report.component';
import { Routes, RouterModule } from '@angular/router';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { NgModule } from '@angular/core';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


const routes: Routes = [{ path: '', component: EWSReportComponent }];
@NgModule({
  declarations: [EWSReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
  exports: [RouterModule]
})
export class EWSReportModule { }
