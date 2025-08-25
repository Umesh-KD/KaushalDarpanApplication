import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIDispatchSuperintendentFormRoutingModule } from './ITI-DispatchSuperintendent-form-routing.module';
import { ITIDispatchSuperintendentFormComponent } from './ITI-DispatchSuperintendent-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    ITIDispatchSuperintendentFormComponent
  ],
  imports: [
    CommonModule,
    ITIDispatchSuperintendentFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ITIDispatchSuperintendentFormModule { }
