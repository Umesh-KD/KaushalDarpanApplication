import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeatIntakesListMasterRoutingModule } from './seat-intakes-list-master-routing.module';
import { SeatIntakesListMasterComponent } from './seat-intakes-list-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    SeatIntakesListMasterComponent
  ],
  imports: [
    CommonModule,
    SeatIntakesListMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class SeatIntakesListMasterModule { }
