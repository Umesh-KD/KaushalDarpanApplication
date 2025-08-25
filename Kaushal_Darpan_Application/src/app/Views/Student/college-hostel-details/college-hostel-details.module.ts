import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeHostelDetailsRoutingModule } from './college-hostel-details-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { CollegeHostelDetailsComponent } from './CollegeHostelDetailsComponent';


@NgModule({
  declarations: [
    CollegeHostelDetailsComponent
  ],
  imports: [
    CommonModule,
    CollegeHostelDetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class CollegeHostelDetailsModule { }

