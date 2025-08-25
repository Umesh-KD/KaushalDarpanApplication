import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentCancellationListRoutingModule } from './enrollment-cancellation-list-routing.module';
import { EnrollmentCancellationListComponent } from './enrollment-cancellation-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    EnrollmentCancellationListComponent
  ],
  imports: [
    CommonModule,
    EnrollmentCancellationListRoutingModule,
    LoaderModule,
    FormsModule, TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class EnrollmentCancellationListModule { }
