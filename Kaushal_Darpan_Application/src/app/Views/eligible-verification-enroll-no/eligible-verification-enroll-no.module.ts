import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EligibleVerificationEnrollNoRoutingModule } from './eligible-verification-enroll-no-routing.module';
import { EligibleVerificationEnrollNoComponent } from './eligible-verification-enroll-no.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    EligibleVerificationEnrollNoComponent
  ],
  imports: [
    CommonModule,
    EligibleVerificationEnrollNoRoutingModule,
    LoaderModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule, MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent  ,

  ]
})
export class EligibleVerificationEnrollNoModule { }
