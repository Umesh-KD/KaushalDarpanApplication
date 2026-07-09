import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementTypeMasterRoutingModule } from './announcementType-master-routing.module';
import { AnnouncementTypeMasterComponent } from './announcementType-master.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AnnouncementTypeMasterComponent
  ],
  imports: [
    CommonModule,
    AnnouncementTypeMasterRoutingModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AnnouncementTypeMasterModule { }
