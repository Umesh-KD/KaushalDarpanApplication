import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddQualificationListRoutingModule } from './add-qualification-list-routing.module';
import { AddQualificationListComponent } from './add-qualification-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    AddQualificationListComponent
  ],
  imports: [
    CommonModule,
    AddQualificationListRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class AddQualificationListModule { }
