import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchPrincipalRevalGroupCodeFormRoutingModule } from './DispatchPrincipalRevalGroupCode-form-routing.module';
import { DispatchPrincipalRevalGroupCodeFormComponent } from './DispatchPrincipalRevalGroupCode-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    DispatchPrincipalRevalGroupCodeFormComponent
  ],
  imports: [
    CommonModule,
    DispatchPrincipalRevalGroupCodeFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class DispatchPrincipalRevalGroupCodeFormModule { }
