import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationFormRoutingModule } from './application-form-routing.module';
import { ApplicationFormComponent } from './application-form.component';
import { PersonalDetailsComponent } from '../personal-details/personal-details.component';
import { QualificationFormComponent } from '../qualification-form/qualification-form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    ApplicationFormComponent,
    //PersonalDetailsComponent,
    //QualificationFormComponent

  ],
  imports: [
    CommonModule,
    ApplicationFormRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ApplicationFormModule { }
