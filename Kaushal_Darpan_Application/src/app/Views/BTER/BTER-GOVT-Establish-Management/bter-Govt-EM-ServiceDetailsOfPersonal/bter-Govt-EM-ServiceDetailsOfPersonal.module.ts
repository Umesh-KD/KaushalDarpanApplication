import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { bterGovtEMServiceDetailsOfPersonalRoutingModule } from './bter-Govt-EM-ServiceDetailsOfPersonal-routing.module';
import { bterGovtEMServiceDetailsOfPersonalComponent } from './bter-Govt-EM-ServiceDetailsOfPersonal.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    bterGovtEMServiceDetailsOfPersonalComponent
  ],
  imports: [
    CommonModule,
    bterGovtEMServiceDetailsOfPersonalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class bterGovtEMServiceDetailsOfPersonalModule { }
