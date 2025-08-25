import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiPlaningDetailsRoutingModule } from './iti-planing-details-routing.module';
import { ItiPlaningDetailsComponent } from './iti-planing-details.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ItiPlaningDetailsComponent
  ],
  imports: [
    CommonModule,
    ItiPlaningDetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ItiPlaningDetailsModule { }











