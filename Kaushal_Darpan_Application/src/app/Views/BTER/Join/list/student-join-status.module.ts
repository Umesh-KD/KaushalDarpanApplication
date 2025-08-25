import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentJoinStatusRoutingModule } from './student-join-status-routing.module';
import { StudentJoinStatusComponent } from './student-join-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../../../material.module';


@NgModule({
  declarations: [
    StudentJoinStatusComponent
  ],
  imports: [
    CommonModule,
    StudentJoinStatusRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    NgbPopoverModule, MaterialModule
  ]
})
export class StudentJoinStatusModule { }
