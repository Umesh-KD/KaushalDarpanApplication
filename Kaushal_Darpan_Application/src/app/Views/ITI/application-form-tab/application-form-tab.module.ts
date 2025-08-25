import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationFormTabRoutingModule } from './application-form-tab-routing.module';
import { ApplicationFormTabComponent } from './application-form-tab.component';
import { PersonalDetailsTabComponent } from '../personal-details-tab/personal-details-tab.component'
import { QualificationTabComponent } from '../qualification-tab/qualification-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';




@NgModule({
  declarations: [
    ApplicationFormTabComponent,
    PersonalDetailsTabComponent,
    QualificationTabComponent
  ],
  imports: [
    CommonModule,
    ApplicationFormTabRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ApplicationFormTabModule { }
