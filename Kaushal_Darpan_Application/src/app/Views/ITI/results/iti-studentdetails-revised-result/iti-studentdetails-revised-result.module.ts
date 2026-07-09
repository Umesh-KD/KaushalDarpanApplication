import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../material.module';
import { ITIStudentDetailsRevisedResultComponent } from './iti-studentdetails-revised-result.component';
import { ITIStudentDetailsRevisedResultRoutingModule } from './iti-studentdetails-revised-result-routing.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';



@NgModule({
  declarations: [
    ITIStudentDetailsRevisedResultComponent
  ],
  imports: [
    CommonModule,
    ITIStudentDetailsRevisedResultRoutingModule,
    LoaderModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, OTPModalModule
  ]
})
export class ITIStudentDetailsRevisedResultModule { }
