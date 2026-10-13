import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PromotionEligibleStudentComponent } from './promotion-eligible-student.component';
import { PromotionEligibleStudentRoutingModule } from './promotion-eligible-student-routing.module';


@NgModule({
  declarations: [
    PromotionEligibleStudentComponent
  ],
  imports: [
    CommonModule,
    PromotionEligibleStudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class PromotionEligibleStudentModule { }
