import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TransferRequestProcessListComponent } from './TransferRequestProcessList.component';
import { TransferRequestProcessListRoutingModule } from './TransferRequestProcessList-routing.module';
import { ViewStaffProfileModalModule } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.model';



@NgModule({
  declarations: [
    TransferRequestProcessListComponent,
  ],
  imports: [
    CommonModule,
    TransferRequestProcessListRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule,
    NgMultiSelectDropDownModule.forRoot(),
    ViewStaffProfileModalModule
  ]
})
export class TransferRequestProcessListModule { }
