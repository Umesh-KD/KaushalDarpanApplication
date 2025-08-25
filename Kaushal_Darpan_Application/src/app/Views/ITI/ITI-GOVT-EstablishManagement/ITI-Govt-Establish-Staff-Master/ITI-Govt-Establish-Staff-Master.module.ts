import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIGovtEstablishStaffMasterComponent } from './ITI-Govt-Establish-Staff-Master.component';
import { ITIGovtEstablishStaffMasterRoutingModule } from './ITI-Govt-Establish-Staff-Master-routing.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';

@NgModule({
    declarations: [
        ITIGovtEstablishStaffMasterComponent
    ],
    imports: [
        CommonModule,
       ITIGovtEstablishStaffMasterRoutingModule,
        FormsModule,
        ReactiveFormsModule,
      LoaderModule,
      TableSearchFilterModule, OTPModalModule
    ]
})
export class ITIGovtEstablishStaffMasterModule { }
