import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostPlanningRoutingModule } from './post-planning-routing.module';
import { PostPlanningComponent } from './post-planning.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    PostPlanningComponent
  ],
  imports: [
    CommonModule,
    PostPlanningRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(), 
    OTPModalModule
  ]
})
export class PostPlanningModule { }
