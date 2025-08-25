import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueTrackerRoutingModule } from './issue-tracker-routing.module';
import { IssueTrackerComponent } from './issue-tracker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    IssueTrackerComponent
  ],
  imports: [
    CommonModule,
    IssueTrackerRoutingModule,
    FormsModule,
    TableSearchFilterModule
    , ReactiveFormsModule
  ]
})
export class IssueTrackerModule { }
