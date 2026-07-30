import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PayLevelMasterComponent } from './pay-level-master.component';
import { PayLevelMasterRoutingModule } from './pay-level-master-routing.module';

@NgModule({
  declarations: [
    PayLevelMasterComponent
  ],
  imports: [
    CommonModule,
    PayLevelMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    // NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class PayLevelMasterModule { }
