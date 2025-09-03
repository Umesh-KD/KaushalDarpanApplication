import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { Routes, RouterModule } from '@angular/router';
import { inventoryIssueHistoryComponent } from './inventory-Issue-History.component';

const routes: Routes = [{ path: '', component: inventoryIssueHistoryComponent }];


@NgModule({
  declarations: [
    inventoryIssueHistoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class inventoryIssueHistoryModule { }
