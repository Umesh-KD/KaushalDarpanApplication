import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiplomaLetterRoutingModule } from './diploma-letter-routing.module';
import { DiplomaLetterComponent } from './diploma-letter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    DiplomaLetterComponent
  ],
  imports: [
    CommonModule,
    DiplomaLetterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class DiplomaLetterModule { }


