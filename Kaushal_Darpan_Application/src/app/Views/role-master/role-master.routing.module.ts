import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleMasterComponent } from './role-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
const routes: Routes = [
  {
    path: '',
    component: RoleMasterComponent
  }
];

@NgModule({
  declarations: [
    RoleMasterComponent
  ],
  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule],
  exports: [RouterModule],
})


export class RoleMasterRoutingModule { }
