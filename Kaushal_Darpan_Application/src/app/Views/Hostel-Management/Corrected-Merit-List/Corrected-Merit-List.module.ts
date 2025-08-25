import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorrectedMeritListRoutingModule } from './Corrected-Merit-List-routing.module';
import { CorrectedMeritListComponent } from './Corrected-Merit-List.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CorrectedMeritListComponent
  ],
  imports: [
    CommonModule,
    CorrectedMeritListRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class CorrectedMeritListModule { }
