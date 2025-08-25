import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIGovtAddEstablishRoutingModule } from './ITI-Govt-AddEstablish-routing.module';
import { ITIGovtAddEstablishComponent } from './ITI-Govt-AddEstablish.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ITIGovtAddEstablishComponent
  ],
  imports: [
    CommonModule,
    ITIGovtAddEstablishRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ITIGovtAddEstablishModule { }
