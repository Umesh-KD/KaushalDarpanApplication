import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DynamicContentListComponent } from './dynamic-content-list.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [{ path: '', component: DynamicContentListComponent }];

@NgModule({
  declarations: [DynamicContentListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DynamicContentListModule { }
