import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iti8ThAdmissionsInWomenWingRoutingModule } from './iti-8th-admissions-in-women-wing-routing.module';
import { Iti8ThAdmissionsInWomenWingComponent } from './iti-8th-admissions-in-women-wing.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    Iti8ThAdmissionsInWomenWingComponent
  ],
  imports: [
    CommonModule,
    Iti8ThAdmissionsInWomenWingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class Iti8ThAdmissionsInWomenWingModule { }











