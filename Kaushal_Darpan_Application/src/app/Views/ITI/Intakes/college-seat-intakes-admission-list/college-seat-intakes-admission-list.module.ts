import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CollegeSeatIntakesAdmissionListComponent } from './college-seat-intakes-admission-list.component';
import { CollegeSeatIntakesAdmissionListRoutingModule } from './college-seat-intakes-admission-list-routing.module';

@NgModule({
  declarations: [
    CollegeSeatIntakesAdmissionListComponent
  ],
  imports: [
    CommonModule,
    CollegeSeatIntakesAdmissionListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class CollegeSeatIntakesAdmissionListModule { }
