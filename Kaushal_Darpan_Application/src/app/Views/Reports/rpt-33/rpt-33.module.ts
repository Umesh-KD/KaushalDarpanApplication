import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { Rpt33Component } from './rpt-33.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: Rpt33Component }];

@NgModule({
  declarations: [
    Rpt33Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    [RouterModule.forChild(routes)],
  ]
})
export class Rpt33Module { }
