import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIDispatchAdminCenterSuperintendentbundleListRoutingModule } from './ITI-DispatchAdminCenterSuperintendentbundleList-routing.module';
import { ITIDispatchAdminCenterSuperintendentbundleListComponent } from './ITI-DispatchAdminCenterSuperintendentbundleList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIDispatchAdminCenterSuperintendentbundleListComponent
  ],
  imports: [
    CommonModule,
    ITIDispatchAdminCenterSuperintendentbundleListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(), OTPModalModule
  ]
})
export class ITIDispatchAdminCenterSuperintendentbundleListModule { }
