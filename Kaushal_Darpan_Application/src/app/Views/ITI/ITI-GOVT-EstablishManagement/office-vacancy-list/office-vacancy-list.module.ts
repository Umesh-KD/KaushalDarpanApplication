import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OfficeVacancyListComponent } from './office-vacancy-list.component';
import { OfficeVacancyListRoutingModule } from './office-vacancy-list-routing.module';

@NgModule({
  declarations: [
    OfficeVacancyListComponent
  ],
  imports: [
    CommonModule,
    OfficeVacancyListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class OfficeVacancyListModule { }
