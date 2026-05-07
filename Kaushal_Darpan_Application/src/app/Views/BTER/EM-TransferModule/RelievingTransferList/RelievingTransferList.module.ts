import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RelievingTransferListComponent } from './RelievingTransferList.component';
import { RelievingTransferListRoutingModule } from './RelievingTransferList-routing.module';



@NgModule({
  declarations: [
    RelievingTransferListComponent,
  ],
  imports: [
    CommonModule,
    RelievingTransferListRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class RelievingTransferListModule { }
