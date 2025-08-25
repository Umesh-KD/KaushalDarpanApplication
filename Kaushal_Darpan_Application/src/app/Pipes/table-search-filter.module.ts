import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TableSearchFilterPipe } from './table-search-filter.pipe';
import { MobileMaskPipe } from './mobile-mask.pipe';
import { FilterPipe } from './filter.pipe';
import { PanAadhaarMaskPipe } from './pan-aadhaar-mask.pipe';

@NgModule({
  declarations: [TableSearchFilterPipe, MobileMaskPipe, FilterPipe, PanAadhaarMaskPipe],
  imports: [
    CommonModule
  ],
  exports: [
    TableSearchFilterPipe, MobileMaskPipe, FilterPipe, PanAadhaarMaskPipe
  ]
})
export class TableSearchFilterModule { }





