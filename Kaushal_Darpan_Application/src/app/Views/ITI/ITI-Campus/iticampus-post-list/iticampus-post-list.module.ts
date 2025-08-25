import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ItiCampusPostListRoutingModule } from './iticampus-post-list-routing.module';
import { ItiCampusPostListComponent } from './iticampus-post-list.component';


@NgModule({
  declarations: [
    ItiCampusPostListComponent
  ],
  imports: [
    CommonModule,
    ItiCampusPostListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ItiCampusPostListModule { }
