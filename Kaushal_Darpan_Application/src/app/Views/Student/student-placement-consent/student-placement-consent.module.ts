import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentPlacementConsentRoutingModule } from './student-placement-consent-routing.module';
import { StudentPlacementConsentComponent } from './student-placement-consent.component';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    StudentPlacementConsentComponent
  ],
  imports: [
    CommonModule,
    StudentPlacementConsentRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class StudentPlacementConsentModule { }
