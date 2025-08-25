import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { AddStaffBasicDetailComponent } from './add-staff-basic-detail.component';
import { AddStaffBasicDetailRoutingModule } from './add-staff-basic-detail-routing.module';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    AddStaffBasicDetailComponent
  ],
  imports: [
    CommonModule,
    AddStaffBasicDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class AddStaffBasicDetailModule { }
