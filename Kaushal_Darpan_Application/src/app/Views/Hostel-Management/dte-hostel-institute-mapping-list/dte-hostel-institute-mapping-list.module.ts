import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { DteHostelInstituteMappingListComponent } from './dte-hostel-institute-mapping-list.component';
import { MaterialModule } from '../../../material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { DteHostelInstituteMappingListRoutingModule } from './dte-hostel-institute-mapping-list-routing.module';


@NgModule({
  declarations: [
    DteHostelInstituteMappingListComponent
  ],
  imports: [
    CommonModule,
    DteHostelInstituteMappingListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    TableSearchFilterModule,
    NgxMatSelectSearchModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class DTEHostelInstituteMappingListModule { }


