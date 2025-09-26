import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { CollegeWiseScholarshipComponent } from './college-wise-scholarship.component';
import { CollegeWiseScholarshipRoutingModule } from './college-wise-scholarship.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CollegeWiseScholarshipComponent
  ],
  imports: [
    CommonModule,
    CollegeWiseScholarshipRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule
  ]
})
export class CollegeWiseScholarshipModule { }
