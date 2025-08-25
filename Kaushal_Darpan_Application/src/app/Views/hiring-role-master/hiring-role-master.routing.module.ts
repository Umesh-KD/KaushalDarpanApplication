import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { HiringRoleMasterComponent } from './hiring-role-master.component';
const routes: Routes = [
  {
    path: '',
    component: HiringRoleMasterComponent
  }
];

@NgModule({
  declarations: [
    HiringRoleMasterComponent
  ],
  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule],
  exports: [RouterModule],
})


export class HiringRoleMasterRoutingModule { }
