import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterRollListRoutingModule } from './center-roll-list-routing.module';
import { CenterRollListComponent } from './center-roll-list.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    CenterRollListComponent
  ],
  imports: [
    CommonModule,
    CenterRollListRoutingModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class CenterRollListModule { }
