import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule } from '@angular/forms';
import { CenterAllocationComponent } from './center-allocation.component';
import { CenterAllocationRoutingModule } from './center-allocation-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



@NgModule({
  declarations: [
    CenterAllocationComponent
  ],
  imports: [
    CommonModule,
    LoaderModule,
    CenterAllocationRoutingModule,
    TableSearchFilterModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class CenterAllocationModule { }
