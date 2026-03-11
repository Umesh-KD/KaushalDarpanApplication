import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { MaterialModule } from '../../../../material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


import { ITIDirectApplicationPrivateFormTabComponent } from './iti-direct-application-private-form-tab.component';
import { ITIDirectApplicationPrivateFormTabRoutingModule } from './iti-direct-application-private-form-tab-routing.module';
import { ITIDirectAddressPrivateFormComponent } from '../iti-direct-address-private-form/iti-direct-address-private-form.component';
import { ITIDirectPreviewPrivateFormComponent } from '../iti-direct-preview-private-form/iti-direct-preview-private-form.component';
import { ITIDirectDocumentPrivateFormComponent } from '../iti-direct-document-private-form/iti-direct-document-private-form.component';
import { ITIDirectQualificationPrivateFormComponent } from '../iti-direct-qualification-private-form/iti-direct-qualification-private-form.component';
import { ITIDirectOptionPrivateFormComponent } from '../iti-direct-option-private-form/iti-direct-option-private-form.component';
import { ITIDirectPersonalPrivateDetailsComponent } from '../iti-direct-personal-private-details/iti-direct-personal-private-details.component';
import { ITIDirectPreviewPrivateFormRoutingModule } from '../iti-direct-preview-private-form/iti-direct-preview-private-form-routing.module';
import { DirectPreviewFormTabModule } from '../iti-direct-preview-private-form/iti-direct-preview-private-form.module';
import { ITIDirectExperienceComponent } from '../iti-direct-expereince/iti-direct-experience.component';




@NgModule({
  declarations: [
    ITIDirectApplicationPrivateFormTabComponent,
    ITIDirectAddressPrivateFormComponent,
    ITIDirectPersonalPrivateDetailsComponent,
    ITIDirectOptionPrivateFormComponent,
    ITIDirectQualificationPrivateFormComponent,
    ITIDirectDocumentPrivateFormComponent,
    ITIDirectExperienceComponent
  ],
  imports: [
    CommonModule,
    ITIDirectApplicationPrivateFormTabRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot(),
    
  ]
})
export class ITIDirectApplicationPrivateFormTabModule { }
