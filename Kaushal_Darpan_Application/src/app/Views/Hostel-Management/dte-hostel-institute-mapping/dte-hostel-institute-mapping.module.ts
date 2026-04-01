import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { DTEHostelInstituteMappingComponent } from './dte-hostel-institute-mapping.component';
import { DTEHostelInstituteMappingRoutingModule } from './dte-hostel-institute-mapping-routing.module';
import { MaterialModule } from '../../../material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    DTEHostelInstituteMappingComponent
  ],
  imports: [
    CommonModule,
    DTEHostelInstituteMappingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    TableSearchFilterModule,
    NgxMatSelectSearchModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class DTEHostelInstituteMappingModule { }


