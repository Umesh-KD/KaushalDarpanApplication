import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIOfficeVacancyRoutingModule } from './ITI-OfficeVacancy-routing.module';
import { ITIOfficeVacancyComponent } from './ITI-OfficeVacancy.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ITIOfficeVacancyComponent
  ],
  imports: [
    CommonModule,
    ITIOfficeVacancyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ITIOfficeVacancyModule { }
