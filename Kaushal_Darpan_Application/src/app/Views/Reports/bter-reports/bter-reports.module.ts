import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { BterReportsComponent } from './bter-reports.component';


const routes: Routes = [{ path: '', component: BterReportsComponent }];

@NgModule({
  declarations: [BterReportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    LoaderModule, MaterialModule
  ], providers: [TableSearchFilterModule]
})
export class BterReportsModule { }

