import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AddIIPEventsComponent } from './add-iip-events.component';
import { AddIIPEventsRoutingModule } from './add-iip-events-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AddIIPEventsComponent
  ],
  imports: [
    CommonModule,
    AddIIPEventsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule, 
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AddIIPEventsModule { }
