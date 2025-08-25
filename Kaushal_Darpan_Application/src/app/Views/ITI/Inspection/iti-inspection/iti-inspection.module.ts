import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIInspectionComponent } from './iti-inspection.component';
import { ITIInspectionRoutingModule } from './iti-inspection-routing.module';

@NgModule({
  declarations: [
    ITIInspectionComponent
  ],
  imports: [
    CommonModule,
    ITIInspectionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIInspectionModule { }
