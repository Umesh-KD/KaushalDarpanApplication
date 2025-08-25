import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsJoiningStatusMarksRoutingModule } from './students-joining-status-marks-routing.module';
import { StudentsJoiningStatusMarksComponent } from './students-joining-status-marks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    StudentsJoiningStatusMarksComponent
  ],
  imports: [
    CommonModule,
    StudentsJoiningStatusMarksRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule,

  ]
})
export class StudentsJoiningStatusMarksModule { }
