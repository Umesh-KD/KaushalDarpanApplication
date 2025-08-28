import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NcvtDataBulkUploadRoutingModule } from './ncvt-data-bulk-upload-routing.module';
import { NcvtDataBulkUploadComponent } from './ncvt-data-bulk-upload.component';
import * as XLSX from 'xlsx';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';




import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';




@NgModule({
  declarations: [
    NcvtDataBulkUploadComponent
  ],
  imports: [
    CommonModule,
    NcvtDataBulkUploadRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule, MatCardModule
  ]
})
export class NcvtDataBulkUploadModule { }






