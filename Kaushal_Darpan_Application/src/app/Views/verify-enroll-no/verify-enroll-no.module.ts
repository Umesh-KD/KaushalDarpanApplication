import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyRollListPdfRoutingModule } from '../verify-roll-list-pdf/verify-roll-list-pdf-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { VerifyEnrollNoComponent } from './verify-enroll-no.component';
import { VerifyEnrollNoRoutingModule } from './verify-enroll-no-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { StudentDetailsViewModalModule } from '../Student/student-details-view-modal/student-details-view-modal.module';


@NgModule({
  declarations: [
    VerifyEnrollNoComponent
  ],
  imports: [
    CommonModule,
    VerifyEnrollNoRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent  ,
    StudentDetailsViewModalModule
  ]
})
export class VerifyEnrollNoModule { }
