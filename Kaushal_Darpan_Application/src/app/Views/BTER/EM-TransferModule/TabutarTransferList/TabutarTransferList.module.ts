import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TabutarTransferListComponent } from './TabutarTransferList.component';
import { TabutarTransferListRoutingModule } from './TabutarTransferList-routing.module';
import { ViewStaffProfileModalModule } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.model';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    TabutarTransferListComponent,
  ],
  imports: [
    CommonModule,
    TabutarTransferListRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule,
    NgMultiSelectDropDownModule.forRoot(),
    ViewStaffProfileModalModule,
    NgSelectModule
  ]
})
export class TabutarTransferListModule { }
