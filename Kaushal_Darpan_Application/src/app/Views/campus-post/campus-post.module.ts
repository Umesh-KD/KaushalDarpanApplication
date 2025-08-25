import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampusPostRoutingModule } from './campus-post-routing.module';
import { CampusPostComponent } from './campus-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    CampusPostComponent
  ],
  imports: [
    CommonModule,
    CampusPostRoutingModule, FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgMultiSelectDropDownModule.forRoot()
  ]
})
export class CampusPostModule { }
