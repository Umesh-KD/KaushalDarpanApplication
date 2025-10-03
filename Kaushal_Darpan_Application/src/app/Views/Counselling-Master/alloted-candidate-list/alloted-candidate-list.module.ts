import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllotedCandidateListComponent } from './alloted-candidate-list.component';
import { AllotedCandidateListRoutingModule } from './alloted-candidate-list-routing.module';


@NgModule({
  declarations: [
    AllotedCandidateListComponent
  ],
  imports: [
    CommonModule,
    AllotedCandidateListRoutingModule,  
    LoaderModule,
    FormsModule, 
    TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class AllotedCandidateListModule { }
