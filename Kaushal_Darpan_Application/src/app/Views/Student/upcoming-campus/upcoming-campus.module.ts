import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpcomingCampusRoutingModule } from './upcoming-campus-routing.module';
import { UpcomingCampusComponent } from './upcoming-campus.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    UpcomingCampusComponent
  ],
  imports: [
    CommonModule,
    UpcomingCampusRoutingModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class UpcomingCampusModule { }
