import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { Routes, RouterModule } from '@angular/router';
import { ITIReturnItemsListComponent } from './iti-return-items-list.component';

const routes: Routes = [{ path: '', component: ITIReturnItemsListComponent }];

@NgModule({
  declarations: [
    ITIReturnItemsListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ITIReturnItemsListModule { }
