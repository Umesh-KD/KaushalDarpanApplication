import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { CounsellingSelectedOptionListComponent } from './counselling-selectedoptionlist.component';
import { CounsellingSelectedOptionListRoutingModule } from './counselling-selectedoptionlist.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CounsellingSelectedOptionListComponent
  ],
  imports: [
    CommonModule,
    CounsellingSelectedOptionListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule
  ]
})
export class CounsellingSelectedOptionListModule { }
