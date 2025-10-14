import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { EditImportedCandidateListRoutingModule } from './edit-imported-candidate-list.routing.module';
import { EditImportedCandidateListComponent } from './edit-imported-candidate-list.component';

@NgModule({
  declarations: [
    EditImportedCandidateListComponent
  ],
  imports: [
    CommonModule,
    EditImportedCandidateListRoutingModule
    ,FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class EditImportedCandidateListModule { }
