import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { studentwithdrawnlistRoutingModule } from './student-withdrawn-list-routing.module';
import { studentwithdrawnlistComponent } from './student-withdrawn-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    studentwithdrawnlistComponent
  ],
  imports: [
    CommonModule,
    studentwithdrawnlistRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class studentwithdrawnlistModule { }
