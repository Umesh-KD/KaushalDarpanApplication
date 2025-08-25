import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddIssueTrackerRoutingModule } from './add-issue-tracker-routing.module';
import { AddIssueTrackerComponent } from './add-issue-tracker.component';
import { LoaderModule } from '../../Shared/loader/loader.module';



@NgModule({
  declarations: [
    AddIssueTrackerComponent
  ],
  imports: [
    CommonModule,
    AddIssueTrackerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderModule,
  ]
})
export class AddIssueTrackerModule {
}
