import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { MaterialModule } from '../../../../material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CousellingCandidateFormTabComponent } from './couselling-candidate-form-tab.component';
import { CandidatePersonalDetailsComponent } from '../candidate-personal-details/candidate-personal-details.component';
import { CandidateDocumentDetailsComponent } from '../candidate-document-details/candidate-document-details.component';
import { CandidateOptionDetailsComponent } from '../candidate-option-details/candidate-option-details.component';
import { CandidateFormPreviewComponent } from '../candidate-form-preview/candidate-form-preview.component';
import { CousellingCandidateFormTabRoutingModule } from './couselling-candidate-form-tab-routing.module';




@NgModule({
  declarations: [
    CousellingCandidateFormTabComponent,
    CandidatePersonalDetailsComponent,
    CandidateDocumentDetailsComponent,
    CandidateOptionDetailsComponent,
    CandidateFormPreviewComponent,
  ],
  imports: [
    CommonModule,
    CousellingCandidateFormTabRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class CousellingCandidateFormTabModule { }
