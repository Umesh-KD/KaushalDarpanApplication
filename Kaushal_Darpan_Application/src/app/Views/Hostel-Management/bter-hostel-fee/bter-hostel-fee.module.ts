import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { BterHostelFeeComponent } from './bter-hostel-fee.component';
import { MaterialModule } from '../../../material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { BterHostelFeeRoutingModule } from './bter-hostel-fee-routing.module';


@NgModule({
  declarations: [
    BterHostelFeeComponent
  ],
  imports: [
    CommonModule,
    BterHostelFeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    TableSearchFilterModule,
    NgxMatSelectSearchModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class BterHostelFeeModule { }


