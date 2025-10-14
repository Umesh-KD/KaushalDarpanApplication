import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module'; 
import { EditCounsellingCandidateFormRoutingModule } from './edit-counselling-candidate-form.routing.module';
import { EditCounsellingCandidateFormComponent } from './edit-counselling-candidate-form.component';
 
@NgModule({
  declarations: [
    EditCounsellingCandidateFormComponent
  ],
  imports: [
    CommonModule,
    EditCounsellingCandidateFormRoutingModule
    ,FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class EditCounsellingCandidateFormModule { }
