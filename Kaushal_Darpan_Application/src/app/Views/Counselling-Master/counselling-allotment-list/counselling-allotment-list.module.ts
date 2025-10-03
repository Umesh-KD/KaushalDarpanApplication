import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { CounsellingAllotmentListComponent } from './counselling-allotment-list.component';
import { CounsellingAllotmentListRoutingModule } from './counselling-allotment-list.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
   CounsellingAllotmentListComponent
  ],
  imports: [
    CommonModule,
    CounsellingAllotmentListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule
  ]
})
export class CounsellingAllotmentListModule { }
