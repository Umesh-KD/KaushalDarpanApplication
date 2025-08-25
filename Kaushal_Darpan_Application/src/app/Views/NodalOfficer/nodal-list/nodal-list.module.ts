import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NodalListRoutingModule } from './nodal-list.routing.module';
import { NodalListComponent } from './nodal-list.component';

@NgModule({
  declarations: [
    NodalListComponent
  ],
  imports: [
    CommonModule,
    NodalListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class NodalListModule { }
