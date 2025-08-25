import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../../material.module';
import { ItiMeritComponent } from './iti-merit.component';
import { ItiMeritRoutingModule } from './iti-merit-routing.module';



@NgModule({
  declarations: [
    ItiMeritComponent
  ],
  imports: [
    CommonModule,
    ItiMeritRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule,
  ]
})
export class ItiMeritModule { }
