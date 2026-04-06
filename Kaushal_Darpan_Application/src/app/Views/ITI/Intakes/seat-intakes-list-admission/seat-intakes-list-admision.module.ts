import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeatIntakesListAdmissionRoutingModule } from './seat-intakes-list-admision-routing.module';
import { SeatIntakesListAdmissionComponent } from './seat-intakes-list-admision.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    SeatIntakesListAdmissionComponent
  ],
  imports: [
    CommonModule,
    SeatIntakesListAdmissionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class SeatIntakesListAdmissionModule { }
