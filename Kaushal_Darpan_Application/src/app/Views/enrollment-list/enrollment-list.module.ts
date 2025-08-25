import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentListRoutingModule } from './enrollment-list-routing.module';
import { EnrollmentListComponent } from './enrollment-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    EnrollmentListComponent
  ],
  imports: [
    CommonModule,
    EnrollmentListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class EnrollmentListModule { }


