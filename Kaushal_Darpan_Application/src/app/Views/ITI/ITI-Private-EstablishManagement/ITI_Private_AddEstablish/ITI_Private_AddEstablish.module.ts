import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIPrivateAddEstablishRoutingModule } from './ITI_Private_AddEstablish-routing.module';
import { ITIPrivateAddEstablishComponent } from './ITI_Private_AddEstablish.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ITIPrivateAddEstablishComponent
  ],
  imports: [
    CommonModule,
   ITIPrivateAddEstablishRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ITIPrivateAddEstablishModule { }
