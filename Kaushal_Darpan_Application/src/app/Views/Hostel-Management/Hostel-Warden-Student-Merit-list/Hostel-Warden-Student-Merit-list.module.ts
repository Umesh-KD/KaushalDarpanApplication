import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostelWardenStudentMeritlistRoutingModule } from './Hostel-Warden-Student-Merit-list-routing.module';
import { HostelWardenStudentMeritlistComponent } from './Hostel-Warden-Student-Merit-list.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HostelWardenStudentMeritlistComponent
  ],
  imports: [
    CommonModule,
    HostelWardenStudentMeritlistRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class HostelWardenStudentMeritlistModule { }
