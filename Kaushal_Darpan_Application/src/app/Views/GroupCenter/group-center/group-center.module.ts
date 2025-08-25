import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupCenterRoutingModule } from './group-center-routing.module';
import { GroupCenterComponent } from './group-center.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    GroupCenterComponent
  ],
  imports: [
    CommonModule,
    GroupCenterRoutingModule,
    FormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class GroupCenterModule { }
