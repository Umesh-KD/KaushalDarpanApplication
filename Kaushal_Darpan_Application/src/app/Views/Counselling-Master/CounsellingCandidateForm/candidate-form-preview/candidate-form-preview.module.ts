import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { MaterialModule } from '../../../../material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CandidateFormPreviewComponent } from '../candidate-form-preview/candidate-form-preview.component';
import { CandidateFormPreviewRoutingModule } from './candidate-form-preview-routing.module';




@NgModule({
  declarations: [
    CandidateFormPreviewComponent,
  ],
  imports: [
    CommonModule,
    CandidateFormPreviewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class CandidateFormPreviewModule { }
