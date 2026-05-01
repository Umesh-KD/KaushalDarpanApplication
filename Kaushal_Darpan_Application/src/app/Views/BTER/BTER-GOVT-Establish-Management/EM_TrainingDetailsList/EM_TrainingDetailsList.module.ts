import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EM_TrainingDetailsListComponent } from './EM_TrainingDetailsList.component';
import { EM_TrainingDetailsListRoutingModule } from './EM_TrainingDetailsList-routing.module';


@NgModule({
  declarations: [
    EM_TrainingDetailsListComponent,
  ],
  imports: [
    CommonModule,
    EM_TrainingDetailsListRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class EM_TrainingDetailsListModule { }
