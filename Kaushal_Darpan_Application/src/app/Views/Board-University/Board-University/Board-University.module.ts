import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardUniversityRoutingModule } from './Board-University-routing.module';
import { BoardUniversityComponent } from './Board-University.component';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    BoardUniversityComponent
  ],
  imports: [
    CommonModule,
    BoardUniversityRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class BoardUniversityModule { }
