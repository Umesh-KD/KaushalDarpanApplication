import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostelRoomDetailsRoutingModule } from './hostel-room-details-routing.module';
import { HostelRoomDetailsComponent } from './hostel-room-details.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HostelRoomDetailsComponent
  ],
  imports: [
    CommonModule,
    HostelRoomDetailsRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class HostelRoomDetailsModule { }
