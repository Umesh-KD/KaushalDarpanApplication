import { NgModule } from '@angular/core';
import { CollegeMasterRoutingModule } from './CollegeListAdminLevel-routing.module';
import { CollegeListAdminLevelComponent } from './CollegeListAdminLevel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    CollegeListAdminLevelComponent
  ],
  imports: [
    CommonModule,MaterialModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule,
    CollegeMasterRoutingModule, TableSearchFilterModule
  ],
  exports: [TableSearchFilterPipe]
})
export class CollegeListAdminLevelModule { }
