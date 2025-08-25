import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { AddItiPrivateStaffMasterComponent } from './add-iti-private-staff-master.component';
import { AddItiPrivateStaffMasterRoutingModule } from './add-iti-private-staff-master-routing.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';

@NgModule({
    declarations: [
        AddItiPrivateStaffMasterComponent
    ],
    imports: [
        CommonModule,
       AddItiPrivateStaffMasterRoutingModule,
        FormsModule,
        ReactiveFormsModule,
      LoaderModule,
      TableSearchFilterModule, OTPModalModule
    ]
})
export class AddItiPrivateStaffMasterModule { }
