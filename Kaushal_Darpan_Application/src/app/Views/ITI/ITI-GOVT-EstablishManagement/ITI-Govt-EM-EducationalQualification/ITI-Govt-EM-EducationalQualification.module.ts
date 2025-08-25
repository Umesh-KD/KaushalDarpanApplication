import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIGovtEMEducationalQualificationRoutingModule } from './ITI-Govt-EM-EducationalQualification-routing.module';
import { ITIGovtEMEducationalQualificationComponent } from './ITI-Govt-EM-EducationalQualification.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ITIGovtEMEducationalQualificationComponent
  ],
  imports: [
    CommonModule,
    ITIGovtEMEducationalQualificationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ITIGovtEMEducationalQualificationModule { }
