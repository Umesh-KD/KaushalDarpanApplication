import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddDTEOfficeVacancyComponent } from './add-dte-office-vacancy.component';
import { AddDTEOfficeVacancyRoutingModule } from './add-dte-office-vacancy-routing.module';

@NgModule({
  declarations: [
    AddDTEOfficeVacancyComponent
  ],
  imports: [
    CommonModule,
    AddDTEOfficeVacancyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class AddDTEOfficeVacancyModule { }
