import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ITIEditItemMasterComponent } from './iti-edit-item-master.component';

const routes: Routes = [{ path: '', component: ITIEditItemMasterComponent }];

@NgModule({
  declarations: [
    ITIEditItemMasterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
  ]
})
export class ITIEditeItemMasterModule { }
