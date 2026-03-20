import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateNodalVerifierRoutingModule } from './create-nodal-verifier-routing.module';
import { CreateNodalVerifierComponent } from './create-nodal-verifier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from '../../../app/material.module';
import { LoaderModule } from '../../../app/Views/Shared/loader/loader.module';


@NgModule({
  declarations: [
    CreateNodalVerifierComponent
  ],

   imports: [
    CommonModule,
     CreateNodalVerifierRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class CreateNodalVerifierModule { }
