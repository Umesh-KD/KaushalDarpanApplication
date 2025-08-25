import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

import { CollegeRollListAdmitCardComponent } from './college-roll-list-admit-card.component';
import { CollegeRollListAdmitCardRoutingModule } from './college-roll-list-admit-card-routing.module';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    CollegeRollListAdmitCardComponent,
  ],
  imports: [
    CommonModule,
    CollegeRollListAdmitCardRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
    ,MaterialModule
  ]
})
export class CollegeRollListAdmitCardModule { }
