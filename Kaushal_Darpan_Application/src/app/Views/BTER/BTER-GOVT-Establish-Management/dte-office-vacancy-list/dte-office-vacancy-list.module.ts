import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DTEOfficeVacancyListComponent } from './dte-office-vacancy-list.component';
import { DTEOfficeVacancyListRoutingModule } from './dte-office-vacancy-list-routing.module';

@NgModule({
  declarations: [
    DTEOfficeVacancyListComponent
  ],
  imports: [
    CommonModule,
    DTEOfficeVacancyListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class DTEOfficeVacancyListModule { }
