import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCollegeSearchRoutingModule } from './iti-college-search-routing.module';
import { ItiCollegeSearchComponent } from './iti-college-search.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ItiCollegeSearchComponent
  ],
  imports: [
    CommonModule,
    ItiCollegeSearchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ItiCollegeSearchModule { }











