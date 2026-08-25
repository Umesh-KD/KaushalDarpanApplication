import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { PublishedRollNoITIComponent } from './published-roll-no-iti.component';
import { PublishedRollNoITIRoutingModule } from './published-roll-no-iti-routing.module';
import { MaterialModule } from '../../../../material.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    PublishedRollNoITIComponent
  ],
  imports: [
    CommonModule,
    PublishedRollNoITIRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    MatCardModule 
  ]
})
export class PublishedRollNoITIModule { }
