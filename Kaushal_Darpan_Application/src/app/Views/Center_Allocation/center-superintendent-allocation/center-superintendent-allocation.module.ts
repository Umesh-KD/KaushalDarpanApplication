import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CenterSuperintendentAllocationComponent } from './center-superintendent-allocation.component';

const routes: Routes = [{ path: '', component: CenterSuperintendentAllocationComponent }];

@NgModule({
  declarations: [
    CenterSuperintendentAllocationComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    TableSearchFilterModule,
    FormsModule,ReactiveFormsModule,
  ]
})
export class CenterSuperintendentAllocationModule { }
