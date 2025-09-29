import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateApplicationListRoutingModule } from './candidate-application-list-routing.module';
import { CandidateApplicationListComponent } from './candidate-application-list.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CandidateApplicationListComponent
  ],
  imports: [
    CommonModule,
    CandidateApplicationListRoutingModule,  LoaderModule,
    FormsModule, TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class CandidateApplicationListModule { }




