import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIGOVTEMPersonalDetailsApplicationFormTabRoutingModule } from './ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab-routing.module';
import { ITIGOVTEMPersonalDetailsApplicationFormTabComponent } from './ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab.component';
//import { PersonalDetailsTabComponent } from '../../ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab.component'
//import { QualificationTabComponent } from '../../ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { MaterialModule } from '../../../../material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';




@NgModule({
  declarations: [
    ITIGOVTEMPersonalDetailsApplicationFormTabComponent,
    //PersonalDetailsTabComponent,
    //QualificationTabComponent
  ],
  imports: [
    CommonModule,
    ITIGOVTEMPersonalDetailsApplicationFormTabRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ITIGOVTEMPersonalDetailsApplicationFormTabModule { }
