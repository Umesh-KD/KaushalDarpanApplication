import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditMeritDocumentRoutingModule } from './edit-merit-document-routing.module';
import { EditMeritDocumentComponent } from './edit-merit-document.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';


@NgModule({
  declarations: [
    EditMeritDocumentComponent
  ],
  imports: [
    CommonModule,
    EditMeritDocumentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    StudentStatusHistoryModule
  ]
})
export class EditMeritDocumentModule { }
