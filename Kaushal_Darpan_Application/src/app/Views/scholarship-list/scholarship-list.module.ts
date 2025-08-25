import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScholarshipListRoutingModule } from './scholarship-list-routing.module';
import { ScholarshipListComponent } from './scholarship-list.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { TableSearchFilterPipe } from '../../Pipes/table-search-filter.pipe';


@NgModule({
  declarations: [
    ScholarshipListComponent
  ],
  imports: [
    CommonModule,
    ScholarshipListRoutingModule,
    FormsModule,
    TableSearchFilterModule,

  ]
})
export class ScholarshipListModule { }
