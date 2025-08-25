import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { MaterialModule } from '../../../../material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ITIDirectApplicationFormTabComponent } from './iti-direct-application-form-tab.component';
import { ITIDirectApplicationFormTabRoutingModule } from './iti-direct-application-form-tab-routing.module';
import { ITIDirectAddressFormComponent } from '../iti-direct-address-form/iti-direct-address-form.component';
import { ITIDirectPreviewFormComponent } from '../iti-direct-preview-form/iti-direct-preview-form.component';
import { ITIDirectDocumentFormComponent } from '../iti-direct-document-form/iti-direct-document-form.component';
import { ITIDirectQualificationFormComponent } from '../iti-direct-qualification-form/iti-direct-qualification-form.component';
import { ITIDirectOptionFormComponent } from '../iti-direct-option-form/iti-direct-option-form.component';
import { ITIDirectPersonalDetailsComponent } from '../iti-direct-personal-details/iti-direct-personal-details.component';




@NgModule({
  declarations: [
    ITIDirectApplicationFormTabComponent,
    ITIDirectAddressFormComponent,
    ITIDirectPersonalDetailsComponent,
    ITIDirectOptionFormComponent,
    ITIDirectQualificationFormComponent,
    ITIDirectDocumentFormComponent,
    ITIDirectPreviewFormComponent,
  ],
  imports: [
    CommonModule,
    ITIDirectApplicationFormTabRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ITIDirectApplicationFormTabModule { }
