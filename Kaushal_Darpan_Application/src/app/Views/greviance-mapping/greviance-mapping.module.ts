import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrevianceMappingRoutingModule } from './greviance-mapping-routing.module';
import { GrevianceMappingComponent } from './greviance-mapping.component';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { routes } from '../../routes';


@NgModule({
  declarations: [
    GrevianceMappingComponent
  ],
  imports: [
    CommonModule,
    GrevianceMappingRoutingModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes),
  ]
})
export class GrevianceMappingModule { }
