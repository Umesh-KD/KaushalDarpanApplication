import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { CollegeAdmissionSeatAllotmentComponent } from './college-admission-seat-allotment.component';
import { CollegeAdmissionSeatAllotmentRoutingModule } from './college-admission-seat-allotment-routing.module';



@NgModule({
  declarations: [
    CollegeAdmissionSeatAllotmentComponent
  ],
  imports: [
    CommonModule,
    CollegeAdmissionSeatAllotmentRoutingModule,
    LoaderModule,
    FormsModule, TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class CollegeAdmissionSeatAllotmentModule { }
