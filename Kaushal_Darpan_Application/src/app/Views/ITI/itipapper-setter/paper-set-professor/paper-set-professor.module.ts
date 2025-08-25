import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaperSetProfessorRoutingModule } from './paper-set-professor-routing.module';
import { PaperSetProfessorComponent } from './paper-set-professor.component';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PaperSetProfessorComponent
  ],
  imports: [
    CommonModule,
    PaperSetProfessorRoutingModule,
    TableSearchFilterModule,
    FormsModule
  ]
})
export class PaperSetProfessorModule { }
