import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { MaterialModule } from '../../../../material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { THTECommitteeComponent } from './thte-committee.component';
import { THTECommitteeRoutingModule } from './thte-committee-routing.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';




@NgModule({
  declarations: [
    THTECommitteeComponent,
  ],
  imports: [
    CommonModule,
    THTECommitteeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class THTECommitteeModule { }
