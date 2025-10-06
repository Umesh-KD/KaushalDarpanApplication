import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { CounsellingImportCandidateListComponent } from './counselling-import-candidate-list.component';
import { CounsellingImportCandidateListRoutingModule } from './counselling-import-candidate-list.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CounsellingImportCandidateListComponent
  ],
  imports: [
    CommonModule,
    CounsellingImportCandidateListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule
  ]
})
export class CounsellingImportCandidateListModule { }
