import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { PdfDownloadComponent } from './Pdf-Download.component';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PdfDownloadRoutingModule } from './Pdf-Download-routing.module';

@NgModule({
  declarations: [
    PdfDownloadComponent
  ],
  imports: [
    CommonModule,
    PdfDownloadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class PdfDownloadModule { }
