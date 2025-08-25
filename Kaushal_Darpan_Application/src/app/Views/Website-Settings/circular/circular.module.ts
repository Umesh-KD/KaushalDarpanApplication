import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { CircularComponent } from './circular.component';
import { CircularRoutingModule } from './circular-routing.module';


@NgModule({
  declarations: [
    CircularComponent
  ],
  imports: [
    CommonModule,
    CircularRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class CircularModule { }
