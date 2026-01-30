import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadAnnexture32ListRoutingModule } from './upload-annexture32-list-routing.module';
import { UploadAnnexture32ListComponent } from './upload-annexture32-list.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    UploadAnnexture32ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableSearchFilterModule,
    UploadAnnexture32ListRoutingModule
  ]
})
export class UploadAnnexture32ListModule { }
