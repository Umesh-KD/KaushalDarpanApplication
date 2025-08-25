import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIStudentPlacementConsentRoutingModule } from './iti-student-placement-consent-routing.module';
import { ITIStudentPlacementConsentComponent } from './iti-student-placement-consent.component';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ITIStudentPlacementConsentComponent
  ],
  imports: [
    CommonModule,
    ITIStudentPlacementConsentRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIStudentPlacementConsentModule { }
