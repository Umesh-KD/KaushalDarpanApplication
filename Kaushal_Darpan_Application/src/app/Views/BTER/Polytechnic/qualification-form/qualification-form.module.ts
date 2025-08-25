import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualificationFormRoutingModule } from './qualification-form-routing.module';
import { QualificationFormComponent } from './qualification-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    QualificationFormComponent
  ],
  imports: [
    CommonModule,
    QualificationFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class QualificationFormModule { }
