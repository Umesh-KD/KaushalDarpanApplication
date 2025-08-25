import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchPrincipalGroupCodeFormRoutingModule } from './DispatchPrincipalGroupCode-form-routing.module';
import {DispatchPrincipalGroupCodeFormComponent } from './DispatchPrincipalGroupCode-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    DispatchPrincipalGroupCodeFormComponent
  ],
  imports: [
    CommonModule,
    DispatchPrincipalGroupCodeFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class DispatchPrincipalGroupCodeFormModule { }
