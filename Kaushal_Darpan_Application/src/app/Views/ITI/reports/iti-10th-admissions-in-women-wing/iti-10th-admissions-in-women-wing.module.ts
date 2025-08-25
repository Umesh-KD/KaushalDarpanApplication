import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iti10ThAdmissionsInWomenWingRoutingModule } from './iti-10th-admissions-in-women-wing-routing.module';
import { Iti10ThAdmissionsInWomenWingComponent } from './iti-10th-admissions-in-women-wing.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    Iti10ThAdmissionsInWomenWingComponent
  ],
  imports: [
    CommonModule,
    Iti10ThAdmissionsInWomenWingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class Iti10ThAdmissionsInWomenWingModule { }











