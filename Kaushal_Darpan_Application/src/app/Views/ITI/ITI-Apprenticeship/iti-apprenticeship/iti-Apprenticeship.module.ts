import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIApprenticeshipComponent } from './iti-Apprenticeship.component';
import { ITIApprenticeshipRoutingModule } from './iti-Apprenticeship-routing.module';

@NgModule({
  declarations: [
    ITIApprenticeshipComponent
  ],
  imports: [
    CommonModule,
    ITIApprenticeshipRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIApprenticeshipModule { }
