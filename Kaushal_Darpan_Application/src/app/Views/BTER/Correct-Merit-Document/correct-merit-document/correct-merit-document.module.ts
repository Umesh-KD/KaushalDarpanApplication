import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

import { CorrectMeritDocumentComponent } from './correct-merit-document.component';
import { CorrectMeritDocumentRoutingModule } from './correct-merit-document-routing.module';
import { CorrectPersonalDetailsComponent } from '../correct-personal-details/correct-personal-details.component';
import { CorrectQualificationDetailsComponent } from '../correct-qualification-details/correct-qualification-details.component';
import { CorrectDocumentFormDetailsComponent } from '../correct-document-form-details/correct-document-form-details.component';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';


@NgModule({
  declarations: [
    CorrectMeritDocumentComponent,
    CorrectPersonalDetailsComponent,
    CorrectQualificationDetailsComponent,
    CorrectDocumentFormDetailsComponent
  ],
  imports: [
    CommonModule,
    CorrectMeritDocumentRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,StudentStatusHistoryModule
  ]
})
export class CorrectMeritDocumentModule { }
