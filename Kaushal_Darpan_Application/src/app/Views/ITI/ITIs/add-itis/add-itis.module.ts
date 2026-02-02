import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddITIsRoutingModule } from './add-itis-routing.module';
import { AddITIsComponent } from './add-itis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    AddITIsComponent
  ],
  imports: [
    CommonModule,
    AddITIsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class AddITIsModule { }
