import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../Student/student-status-history/student-status-history.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { QualificationMasterComponent } from './qualification-master.component';
import { QualificationMasterRoutingModule } from './qualification-master-routing.module';


@NgModule({
  declarations: [
    QualificationMasterComponent,
  ],
  imports: [
    CommonModule,
    QualificationMasterRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class QualificationMasterModule { }
