import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ITICollegeWiseScholarshipComponent } from './iticollege-wise-scholarship.component';
import { ITICollegeWiseScholarshipRoutingModule } from './iticollege-wise-scholarship.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ITICollegeWiseScholarshipComponent
  ],
  imports: [
    CommonModule,
    ITICollegeWiseScholarshipRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule
  ]
})
export class ITICollegeWiseScholarshipModule { }
