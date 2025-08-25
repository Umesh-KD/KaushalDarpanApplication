import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIGovtEMServiceDetailsOfPersonalRoutingModule } from './ITI-Govt-EM-ServiceDetailsOfPersonal-routing.module';
import { ITIGovtEMServiceDetailsOfPersonalComponent } from './ITI-Govt-EM-ServiceDetailsOfPersonal.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ITIGovtEMServiceDetailsOfPersonalComponent
  ],
  imports: [
    CommonModule,
    ITIGovtEMServiceDetailsOfPersonalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ITIGovtEMServiceDetailsOfPersonalModule { }
