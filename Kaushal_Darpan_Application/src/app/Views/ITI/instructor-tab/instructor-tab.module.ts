import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorTabRoutingModule } from './instructor-tab-routing.module';
import { InstructorTabComponent } from './instructor-tab.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { ITIPublicInfoTabsModule } from '../../itipublic-info-tabs/itipublic-info-tabs.module';


@NgModule({
  declarations: [
    InstructorTabComponent
  ],
  imports: [
    CommonModule,
    InstructorTabRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule, OTPModalModule, ITIPublicInfoTabsModule
  ]
})
export class InstructorTabModule { }
