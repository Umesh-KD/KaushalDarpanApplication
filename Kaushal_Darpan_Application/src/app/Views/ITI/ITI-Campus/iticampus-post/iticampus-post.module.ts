import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItiCampusPostComponent } from './iticampus-post.component';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ItiCampusPostRoutingModule } from './iticampus-post-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



@NgModule({
  declarations: [
    ItiCampusPostComponent
  ],
  imports: [
    CommonModule,
    ItiCampusPostRoutingModule, FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ItiCampusPostModule { }
