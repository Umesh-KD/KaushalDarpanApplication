import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchSuperintendentFormRoutingModule } from './DispatchSuperintendent-form-routing.module';
import { DispatchSuperintendentFormComponent } from './DispatchSuperintendent-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    DispatchSuperintendentFormComponent
  ],
  imports: [
    CommonModule,
    DispatchSuperintendentFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class DispatchSuperintendentFormModule { }
